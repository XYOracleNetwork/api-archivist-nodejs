import { delay } from '@xylabs/sdk-js'
import { debugSchema, SetArchivePermissions, SetArchivePermissionsPayload, setArchivePermissionsSchema } from '@xyo-network/archivist-model'
import { claimArchive, getExistingUser, postCommandsToArchive, signInUser, TestWeb3User } from '@xyo-network/archivist-test'
import { XyoBoundWitnessBuilder, XyoPayloadBuilder } from '@xyo-network/sdk-xyo-client-js'
import { StatusCodes } from 'http-status-codes'

const allowedSchema = debugSchema
const otherSchema = 'network.xyo.test'

const processingDelay = () => {
  return delay(2000)
}

type TestSchemaTypes = typeof allowedSchema | typeof otherSchema

const setArchivePermissions = (archive: string, token: string, permissions: SetArchivePermissions) => {
  const data: SetArchivePermissionsPayload = {
    ...permissions,
    schema: setArchivePermissionsSchema,
  }
  const payload = new XyoPayloadBuilder<SetArchivePermissionsPayload>({ schema: setArchivePermissionsSchema }).fields(data).build()
  const bw = new XyoBoundWitnessBuilder({ inlinePayloads: true }).payload(payload).build()
  return postCommandsToArchive([bw], archive, token)
}

const postCommandToArchive = (
  archive: string,
  token?: string,
  schema: TestSchemaTypes = allowedSchema,
  expectedStatus: StatusCodes = StatusCodes.ACCEPTED,
) => {
  const data = {
    schema,
  }
  const payload = new XyoPayloadBuilder<{ schema: TestSchemaTypes }>({ schema }).fields(data).build()
  const bw = new XyoBoundWitnessBuilder({ inlinePayloads: true }).payload(payload).build()
  return postCommandsToArchive([bw], archive, token, expectedStatus)
}

const initializeTestData = async () => {
  const owner = await getExistingUser()
  const ownerToken = await signInUser(owner)
  const archive = (await claimArchive(ownerToken)).archive
  const user = await getExistingUser()
  const userToken = await signInUser(user)
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
      await processingDelay()
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
          addresses: {
            allow: [user.address],
          },
          schema: setArchivePermissionsSchema,
        })
        await processingDelay()
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
          const other = await getExistingUser()
          const otherToken = await signInUser(other)
          await postCommandToArchive(archive, otherToken, allowedSchema, StatusCodes.FORBIDDEN)
        })
        it('anonymous', async () => {
          await postCommandToArchive(archive, undefined, allowedSchema, StatusCodes.UNAUTHORIZED)
        })
      })
    })
    describe('for allowing schema', () => {
      beforeAll(async () => {
        ;({ archive, ownerToken, user, userToken } = await initializeTestData())
        await setArchivePermissions(archive, ownerToken, {
          schema: setArchivePermissionsSchema,
          schemas: {
            allow: [allowedSchema],
          },
        })
        await processingDelay()
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
          addresses: {
            reject: [user.address],
          },
          schema: setArchivePermissionsSchema,
        })
        await processingDelay()
      })
      describe('allows', () => {
        it('owner', async () => {
          await postCommandToArchive(archive, ownerToken)
        })
        it('address not in disallowed list', async () => {
          const otherUser = await getExistingUser()
          const otherToken = await signInUser(otherUser)
          await postCommandToArchive(archive, otherToken)
        })
      })
      describe('disallows', () => {
        it('address in disallowed list', async () => {
          await postCommandToArchive(archive, userToken, allowedSchema, StatusCodes.FORBIDDEN)
        })
        it('anonymous', async () => {
          await postCommandToArchive(archive, undefined, allowedSchema, StatusCodes.UNAUTHORIZED)
        })
      })
    })
    describe('for rejecting schema', () => {
      beforeAll(async () => {
        ;({ archive, ownerToken, user, userToken } = await initializeTestData())
        await setArchivePermissions(archive, ownerToken, {
          schema: setArchivePermissionsSchema,
          schemas: {
            reject: [otherSchema],
          },
        })
        await processingDelay()
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
