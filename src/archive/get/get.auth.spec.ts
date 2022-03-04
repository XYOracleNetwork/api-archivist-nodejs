import { ArchiveResponse } from '@xyo-network/sdk-xyo-client-js'
import { StatusCodes } from 'http-status-codes'

import { claimArchive, getArchivist, getTokenForNewUser, setArchiveAccessControl } from '../../test'

function getInvalidVersionOfToken(token: string) {
  const half = Math.floor(token.length / 2)
  return token.substring(0, half) + 'foo' + token.substring(half)
}

// TODO: Update getArchive from test util to conditionally take a token
// instead of doing it here
const callApi = async (token?: string, expectedStatus: StatusCodes = StatusCodes.OK): Promise<ArchiveResponse> => {
  const response = token
    ? await getArchivist().get('/archive').auth(token, { type: 'bearer' }).expect(expectedStatus)
    : await getArchivist().get('/archive').expect(expectedStatus)
  return response.body.data
}

describe('/archive', () => {
  let archive = ''
  let token = ''
  beforeAll(async () => {
    // Create public archive
    token = await getTokenForNewUser()
    archive = (await claimArchive(token)).archive
    await setArchiveAccessControl(token, archive, { accessControl: false })
  })
  it('with token absent allows access', async () => {
    await callApi(undefined, StatusCodes.OK)
  })
  it('with token allows access', async () => {
    await callApi(token, StatusCodes.OK)
  })
  it('with invalid token does not allow access', async () => {
    const newToken = getInvalidVersionOfToken(token)
    await callApi(newToken, StatusCodes.UNAUTHORIZED)
  })
})
