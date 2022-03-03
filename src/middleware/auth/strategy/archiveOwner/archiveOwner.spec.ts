import { StatusCodes } from 'http-status-codes'

import { claimArchive, getArchivist, getTokenForNewUser, setArchiveAccessControl } from '../../../../test'

describe.skip('archiveOwner', () => {
  describe('with public archive', () => {
    let archive = ''
    let token = ''
    beforeAll(async () => {
      // Create public archive
      token = await getTokenForNewUser()
      archive = (await claimArchive(token)).archive
      await setArchiveAccessControl(token, archive, { accessControl: false })
    })
    it('with token absent allows access', async () => {
      const response = await getArchivist().get('/').expect(StatusCodes.OK)
    })
    it('with token for user who owns the archive allows access', async () => {
      const response = await getArchivist().get('/').expect(StatusCodes.OK)
    })
    it('with token for user who does not own the archive allows access', async () => {
      const response = await getArchivist().get('/').expect(StatusCodes.OK)
    })
    it('with invalid token does not allow access', async () => {
      const response = await getArchivist().get('/').expect(StatusCodes.UNAUTHORIZED)
    })
  })
  describe('with private archive', () => {
    let archive = ''
    let token = ''
    beforeAll(async () => {
      // Create private archive
      token = await getTokenForNewUser()
      archive = (await claimArchive(token)).archive
      await setArchiveAccessControl(token, archive, { accessControl: true })
    })
    it('with token absent does not allow access', async () => {
      const response = await getArchivist().get('/').expect(StatusCodes.OK)
    })
    it('with token for user who owns the archive allows access', async () => {
      const response = await getArchivist().get('/').expect(StatusCodes.OK)
    })
    it('with token for user who does not own the archive  does not allow access', async () => {
      const response = await getArchivist().get('/').expect(StatusCodes.UNAUTHORIZED)
    })
    it('with invalid token does not allow access', async () => {
      const response = await getArchivist().get('/').expect(StatusCodes.UNAUTHORIZED)
    })
  })
})
