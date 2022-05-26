import { XyoBoundWitnessBuilder, XyoPayloadBuilder } from '@xyo-network/sdk-xyo-client-js'
import { StatusCodes } from 'http-status-codes'

import { SetArchivePermissions, SetArchivePermissionsPayload, setArchivePermissionsSchema } from '../../../../model'
import { claimArchive, getExistingWeb3User, postCommands, signInWeb3User, TestWeb3User } from '../../../../test'

const allowedSchema = 'network.xyo.debug'
const otherSchema = 'network.xyo.test'

const setArchivePermissions = (archive: string, token: string, permissions: SetArchivePermissions) => {
  const data: SetArchivePermissionsPayload = {
    ...permissions,
    _archive: archive,
    schema: setArchivePermissionsSchema,
  }
  const payload = new XyoPayloadBuilder({ schema: setArchivePermissionsSchema }).fields(data).build()
  payload._archive = archive
  const bw = new XyoBoundWitnessBuilder({ inlinePayloads: true }).payload(payload).build()
  bw._archive = archive
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  bw._payloads![0]._archive = archive
  return postCommands([bw], token)
}

const postCommandToArchive = (archive: string, token?: string, schema = allowedSchema, expectedStatus: StatusCodes = StatusCodes.OK) => {
  const data = {
    _archive: archive,
    schema,
  }
  const payload = new XyoPayloadBuilder({ schema }).fields(data).build()
  const bw = new XyoBoundWitnessBuilder({ inlinePayloads: true }).payload(payload).build()
  bw._archive = archive
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  bw._payloads![0]._archive = archive
  return postCommands([bw], token, expectedStatus)
}

describe('ArchiveAccountStrategy', () => {
  let user: TestWeb3User
  let token: string
  let archive: string
  describe('with no archive permissions', () => {
    beforeAll(async () => {
      user = await getExistingWeb3User()
      token = await signInWeb3User(user)
      archive = (await claimArchive(token)).archive
    })
    describe('with allowed address', () => {
      it('allows operation by address', async () => {
        await postCommandToArchive(archive, token)
      })
    })
    describe('with anonymous', () => {
      it('allows operation', async () => {
        await postCommandToArchive(archive)
      })
    })
  })
  describe('with archive permissions', () => {
    describe('for allowing', () => {
      describe('address', () => {
        beforeAll(async () => {
          user = await getExistingWeb3User()
          token = await signInWeb3User(user)
          archive = (await claimArchive(token)).archive
          await setArchivePermissions(archive, token, {
            allow: {
              addresses: [user.address],
            },
            schema: setArchivePermissionsSchema,
          })
        })
        describe('with allowed address', () => {
          it('allows operation by address', async () => {
            await postCommandToArchive(archive, token)
          })
        })
        describe('with address not in allowed list', () => {
          it('disallows operation by address', async () => {
            const otherUser = await getExistingWeb3User()
            const otherToken = await signInWeb3User(otherUser)
            await postCommandToArchive(archive, otherToken, allowedSchema, StatusCodes.FORBIDDEN)
          })
        })
        describe('with anonymous', () => {
          it('disallows operation', async () => {
            await postCommandToArchive(archive, undefined, allowedSchema, StatusCodes.FORBIDDEN)
          })
        })
      })
      describe('schema', () => {
        beforeAll(async () => {
          user = await getExistingWeb3User()
          token = await signInWeb3User(user)
          archive = (await claimArchive(token)).archive
          await setArchivePermissions(archive, token, {
            allow: {
              schemas: [allowedSchema],
            },
            schema: setArchivePermissionsSchema,
          })
        })
        describe('with allowed schema', () => {
          it('allows operation for schema', async () => {
            await postCommandToArchive(archive, token)
          })
        })
        describe('with schema not in allowed list', () => {
          it('disallows operation for schema', async () => {
            await postCommandToArchive(archive, token, otherSchema, StatusCodes.FORBIDDEN)
          })
        })
      })
    })
    describe('for rejecting', () => {
      describe('address', () => {
        let otherUser: TestWeb3User
        let otherToken: string
        beforeAll(async () => {
          otherUser = await getExistingWeb3User()
          otherToken = await signInWeb3User(otherUser)
          user = await getExistingWeb3User()
          token = await signInWeb3User(user)
          archive = (await claimArchive(token)).archive
          await setArchivePermissions(archive, token, {
            reject: {
              addresses: [otherUser.address],
            },
            schema: setArchivePermissionsSchema,
          })
        })
        describe('with disallowed address', () => {
          it('disallows operation by address', async () => {
            await postCommandToArchive(archive, otherToken, allowedSchema, StatusCodes.FORBIDDEN)
          })
        })
        describe('with address not in disallowed list', () => {
          it('allows operation by address', async () => {
            const otherUser = await getExistingWeb3User()
            const otherToken = await signInWeb3User(otherUser)
            await postCommandToArchive(archive, otherToken)
          })
        })
        describe('with anonymous address', () => {
          it('disallows operation', async () => {
            await postCommandToArchive(archive, undefined, allowedSchema, StatusCodes.FORBIDDEN)
          })
        })
      })
      describe('schema', () => {
        beforeAll(async () => {
          user = await getExistingWeb3User()
          token = await signInWeb3User(user)
          archive = (await claimArchive(token)).archive
          await setArchivePermissions(archive, token, {
            reject: {
              schemas: [otherSchema],
            },
            schema: setArchivePermissionsSchema,
          })
        })
        describe('with disallowed schema', () => {
          it('disallows operation for schema', async () => {
            await postCommandToArchive(archive, token, otherSchema, StatusCodes.FORBIDDEN)
          })
        })
        describe('with schema not in disallowed list', () => {
          it('allows operation for schema', async () => {
            await postCommandToArchive(archive, token)
          })
        })
      })
    })
  })
})
