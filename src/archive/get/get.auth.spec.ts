import { StatusCodes } from 'http-status-codes'

import { claimArchive, getArchives, getTokenForNewUser, setArchiveAccessControl } from '../../test'

const getInvalidVersionOfToken = (token: string) => {
  const half = Math.floor(token.length / 2)
  return token.substring(0, half) + 'foo' + token.substring(half)
}

describe('/archive', () => {
  describe('with token', () => {
    let archive = ''
    let token = ''
    beforeAll(async () => {
      // Create public archive
      token = await getTokenForNewUser()
      archive = (await claimArchive(token)).archive
      await setArchiveAccessControl(token, archive, { accessControl: false })
    })
    it('supplied allows access', async () => {
      await getArchives(token, StatusCodes.OK)
    })
    it('absent allows access', async () => {
      await getArchives(undefined, StatusCodes.OK)
    })
    it('invalid does not allow access', async () => {
      const newToken = getInvalidVersionOfToken(token)
      await getArchives(newToken, StatusCodes.UNAUTHORIZED)
    })
  })
})
