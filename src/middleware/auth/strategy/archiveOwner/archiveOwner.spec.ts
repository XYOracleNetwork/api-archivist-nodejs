import { ArchiveResponse } from '@xyo-network/sdk-xyo-client-js'
import { StatusCodes } from 'http-status-codes'

import { claimArchive, getArchivist, getTokenForNewUser, setArchiveAccessControl } from '../../../../test'

function getInvalidVersionOfToken(token: string) {
  const half = Math.floor(token.length / 2)
  return token.substring(0, half) + 'foo' + token.substring(half)
}

// TODO: Update getArchive from test util to conditionally take a token
// instead of doing it here
const callApi = async (
  archive: string,
  token?: string,
  expectedStatus: StatusCodes = StatusCodes.OK
): Promise<ArchiveResponse> => {
  const response = token
    ? await getArchivist().get(`/archive/${archive}`).auth(token, { type: 'bearer' }).expect(expectedStatus)
    : await getArchivist().get(`/archive/${archive}`).expect(expectedStatus)
  return response.body.data
}

describe('archiveOwner', () => {
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
      await callApi(archive, undefined, StatusCodes.OK)
    })
    it('with token for user who owns the archive allows access', async () => {
      await callApi(archive, token, StatusCodes.OK)
    })
    it('with token for user who does not own the archive allows access', async () => {
      const newToken = await getTokenForNewUser()
      await callApi(archive, newToken, StatusCodes.OK)
    })
    it('with invalid token does not allow access', async () => {
      const newToken = getInvalidVersionOfToken(token)
      await callApi(archive, newToken, StatusCodes.UNAUTHORIZED)
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
      await callApi(archive, undefined, StatusCodes.UNAUTHORIZED)
    })
    it('with token for user who owns the archive allows access', async () => {
      await callApi(archive, token, StatusCodes.OK)
    })
    it('with token for user who does not own the archive does not allow access', async () => {
      const newToken = await getTokenForNewUser()
      await callApi(archive, newToken, StatusCodes.OK)
    })
    it('with invalid token does not allow access', async () => {
      const newToken = getInvalidVersionOfToken(token)
      await callApi(archive, newToken, StatusCodes.UNAUTHORIZED)
    })
  })
})
