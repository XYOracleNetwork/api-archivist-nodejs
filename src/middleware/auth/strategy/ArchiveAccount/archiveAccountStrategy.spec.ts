import { StatusCodes } from 'http-status-codes'

import { ArchivePermissions, ArchivePermissionsPayload } from '../../../../model'
import { claimArchive, getArchivist, getExistingWeb3User, signInWeb3User, TestWeb3User } from '../../../../test'

const allowedSchema = 'network.xyo.debug'
const otherSchema = 'network.xyo.test'

const setArchivePermissions = async (archive: string, token: string, permissions: ArchivePermissions) => {
  const data: ArchivePermissionsPayload = {
    ...permissions,
    _archive: archive,
    schema: 'network.xyo.security.archive.permissions',
  }
  const response = await getArchivist().post('/').send(data).auth(token, { type: 'bearer' }).expect(StatusCodes.OK)
  return response.body.data
}

const postCommandToArchive = async (archive: string, token?: string, schema = allowedSchema, expectedStatus: StatusCodes = StatusCodes.OK) => {
  const data = {
    _archive: archive,
    schema,
  }
  const response = token
    ? await getArchivist().post('/').send(data).auth(token, { type: 'bearer' }).expect(expectedStatus)
    : await getArchivist().post('/').send(data).expect(expectedStatus)
  return response.body.data
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
            schema: 'network.xyo.security.archive.permissions',
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
            await postCommandToArchive(archive, otherToken, allowedSchema, StatusCodes.UNAUTHORIZED)
          })
        })
        describe('with anonymous', () => {
          it('disallows operation', async () => {
            await postCommandToArchive(archive, undefined, allowedSchema, StatusCodes.UNAUTHORIZED)
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
            schema: 'network.xyo.security.archive.permissions',
          })
        })
        describe('with allowed schema', () => {
          it('allows operation by address', async () => {
            await postCommandToArchive(archive, token)
          })
        })
        describe('with schema not in allowed list', () => {
          it('disallows operation by address', async () => {
            await postCommandToArchive(archive, token, otherSchema, StatusCodes.UNAUTHORIZED)
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
            schema: 'network.xyo.security.archive.permissions',
          })
        })
        describe('with disallowed address', () => {
          it('disallows operation by address', async () => {
            await postCommandToArchive(archive, otherToken)
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
          it('allows operation by address', async () => {
            await postCommandToArchive(archive)
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
            schema: 'network.xyo.security.archive.permissions',
          })
        })
        describe('with disallowed schema', () => {
          it('disallows operation by address', async () => {
            await postCommandToArchive(archive, token, otherSchema)
          })
        })
        describe('with schema not in disallowed list', () => {
          it('allows operation by address', async () => {
            await postCommandToArchive(archive, token)
          })
        })
      })
    })
  })
})
