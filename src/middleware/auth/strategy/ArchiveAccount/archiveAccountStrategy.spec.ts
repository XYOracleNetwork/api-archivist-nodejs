import { StatusCodes } from 'http-status-codes'

import { claimArchive, getArchivist, getExistingWeb3User, signInWeb3User } from '../../../../test'

const postCommandToArchive = async (archive: string, token?: string, expectedStatus: StatusCodes = StatusCodes.OK) => {
  const data = {
    _archive: archive,
    schema: 'network.xyo.debug',
  }
  const response = token
    ? await getArchivist().post('/').send(data).auth(token, { type: 'bearer' }).expect(expectedStatus)
    : await getArchivist().post('/').send(data).expect(expectedStatus)
  return response.body.data
}

describe('ArchiveAccountStrategy', () => {
  let token: string
  let archive: string
  beforeAll(async () => {
    token = await signInWeb3User(await getExistingWeb3User())
    archive = (await claimArchive(token)).archive
  })
  describe('with no archive permissions', () => {
    describe('with allowed address', () => {
      it('allows operation by address', async () => {
        await postCommandToArchive(archive, token)
      })
    })
    describe('with anonymous', () => {
      it('allows operation', async () => {
        await postCommandToArchive(archive, token)
      })
    })
  })
  describe('with archive permissions', () => {
    describe('for allowing', () => {
      describe('address', () => {
        describe('with allowed address', () => {
          it('allows operation by address', async () => {
            await postCommandToArchive(archive, token)
          })
        })
        describe('with address not in allowed list', () => {
          it('disallows operation by address', async () => {
            // TODO:
          })
        })
        describe('with anonymous', () => {
          it('disallows operation', async () => {
            // TODO:
          })
        })
      })
      describe('schema', () => {
        describe('with allowed schema', () => {
          it('allows operation by address', async () => {
            // TODO:
          })
        })
        describe('with schema not in allowed list', () => {
          it('disallows operation by address', async () => {
            // TODO:
          })
        })
      })
    })
    describe('for rejecting', () => {
      describe('address', () => {
        describe('with disallowed address', () => {
          it('disallows operation by address', async () => {
            // TODO:
          })
        })
        describe('with address not in disallowed list', () => {
          it('TODO: allows operation by address', async () => {
            // TODO:
          })
        })
        describe('with anonymous address', () => {
          it('TODO: allows operation by address', async () => {
            // TODO:
          })
        })
      })
      describe('schema', () => {
        describe('with disallowed schema', () => {
          it('disallows operation by address', async () => {
            // TODO:
          })
        })
        describe('with schema not in disallowed list', () => {
          it('allows operation by address', async () => {
            // TODO:
          })
        })
      })
    })
  })
})
