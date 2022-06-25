import { XyoBoundWitnessBuilder, XyoPayloadBuilder } from '@xyo-network/sdk-xyo-client-js'
import { StatusCodes } from 'http-status-codes'

import { debugSchema, SetArchivePermissions, SetArchivePermissionsPayload, setArchivePermissionsSchema } from '../../../../model'
import { claimArchive, getExistingWeb3User, postCommandsToArchive, signInWeb3User, TestWeb3User } from '../../../../test'

const allowedSchema = debugSchema
const otherSchema = 'network.xyo.test'

const setArchivePermissions = (archive: string, token: string, permissions: SetArchivePermissions) => {
  const data: SetArchivePermissionsPayload = {
    ...permissions,
    schema: setArchivePermissionsSchema,
  }
  const payload = new XyoPayloadBuilder<SetArchivePermissionsPayload>({ schema: setArchivePermissionsSchema }).fields(data).build()
  const bw = new XyoBoundWitnessBuilder({ inlinePayloads: true }).payload(payload).build()
  return postCommandsToArchive([bw], archive, token)
}

const postCommandToArchive = (archive: string, token?: string, schema = allowedSchema, expectedStatus: StatusCodes = StatusCodes.ACCEPTED) => {
  const data = {
    schema,
  }
  const payload = new XyoPayloadBuilder({ schema }).fields(data).build()
  const bw = new XyoBoundWitnessBuilder({ inlinePayloads: true }).payload(payload).build()
  return postCommandsToArchive([bw], archive, token, expectedStatus)
}

const initializeTestData = async () => {
  const owner = await getExistingWeb3User()
  const ownerToken = await signInWeb3User(owner)
  const archive = (await claimArchive(ownerToken)).archive
  const user = await getExistingWeb3User()
  const userToken = await signInWeb3User(user)
  return {
    archive,
    owner,
    ownerToken,
    user,
    userToken,
  }
}

describe('ArchiveAccountStrategy', () => {
  let user: TestWeb3User
  let ownerToken: string
  let userToken: string
  let archive: string
  describe('with no archive permissions', () => {
    beforeAll(async () => {
      ;({ archive, ownerToken, user, userToken } = await initializeTestData())
    })
    describe('allows', () => {
      it('owner', async () => {
        await postCommandToArchive(archive, ownerToken)
      })
      it('address', async () => {
        await postCommandToArchive(archive, userToken)
      })
      it('anonymous', async () => {
        await postCommandToArchive(archive)
      })
    })
  })
  describe('with archive permissions', () => {
    describe('for allowing address', () => {
      beforeAll(async () => {
        ;({ archive, ownerToken, user, userToken } = await initializeTestData())
        await setArchivePermissions(archive, ownerToken, {
          allow: {
            addresses: [user.address],
          },
          schema: setArchivePermissionsSchema,
        })
      })
      describe('allows address of', () => {
        it('owner', async () => {
          await postCommandToArchive(archive, ownerToken)
        })
        it('address in list', async () => {
          await postCommandToArchive(archive, userToken)
        })
      })
      describe('disallows address of', () => {
        it('user not in list', async () => {
          const other = await getExistingWeb3User()
          const otherToken = await signInWeb3User(other)
          await postCommandToArchive(archive, otherToken, allowedSchema, StatusCodes.FORBIDDEN)
        })
        it('anonymous', async () => {
          await postCommandToArchive(archive, undefined, allowedSchema, StatusCodes.FORBIDDEN)
        })
      })
    })
    describe('for allowing schema', () => {
      beforeAll(async () => {
        ;({ archive, ownerToken, user, userToken } = await initializeTestData())
        await setArchivePermissions(archive, ownerToken, {
          allow: {
            schemas: [allowedSchema],
          },
          schema: setArchivePermissionsSchema,
        })
      })
      describe('allows schema', () => {
        it('in list', async () => {
          await postCommandToArchive(archive, ownerToken)
        })
        it('not in list for owner', async () => {
          await postCommandToArchive(archive, ownerToken, otherSchema)
        })
      })
      describe('disallows schema', () => {
        it('not in list', async () => {
          await postCommandToArchive(archive, userToken, otherSchema, StatusCodes.FORBIDDEN)
        })
      })
    })
    describe('for rejecting address', () => {
      beforeAll(async () => {
        ;({ archive, ownerToken, user, userToken } = await initializeTestData())
        await setArchivePermissions(archive, ownerToken, {
          reject: {
            addresses: [user.address],
          },
          schema: setArchivePermissionsSchema,
        })
      })
      describe('allows', () => {
        it('owner', async () => {
          await postCommandToArchive(archive, ownerToken)
        })
        it('address not in disallowed list', async () => {
          const otherUser = await getExistingWeb3User()
          const otherToken = await signInWeb3User(otherUser)
          await postCommandToArchive(archive, otherToken)
        })
      })
      describe('disallows', () => {
        it('address in disallowed list', async () => {
          await postCommandToArchive(archive, userToken, allowedSchema, StatusCodes.FORBIDDEN)
        })
        it('anonymous', async () => {
          await postCommandToArchive(archive, undefined, allowedSchema, StatusCodes.FORBIDDEN)
        })
      })
    })
    describe('for rejecting schema', () => {
      beforeAll(async () => {
        ;({ archive, ownerToken, user, userToken } = await initializeTestData())
        await setArchivePermissions(archive, ownerToken, {
          reject: {
            schemas: [otherSchema],
          },
          schema: setArchivePermissionsSchema,
        })
      })
      describe('allows', () => {
        it('owner to perform schema in disallowed list', async () => {
          await postCommandToArchive(archive, ownerToken, otherSchema)
        })
        it('schema not in disallowed list', async () => {
          await postCommandToArchive(archive, userToken)
        })
      })
      describe('disallows', () => {
        it('schema in disallowed list', async () => {
          await postCommandToArchive(archive, userToken, otherSchema, StatusCodes.FORBIDDEN)
        })
      })
    })
  })
})
