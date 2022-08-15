import { StatusCodes } from 'http-status-codes'

import { claimArchive, createArchiveKey, getArchiveKeys, getArchivist, getTokenForNewUser } from '../../../../../../testUtil'

describe('/archive/:archive/settings/key', () => {
  let token = ''
  let archive = ''
  beforeEach(async () => {
    token = await getTokenForNewUser()
    archive = (await claimArchive(token)).archive
  })
  describe('auth', () => {
    it('is required', async () => {
      await getArchivist().get(`/archive/${archive}/settings/key`).expect(StatusCodes.UNAUTHORIZED)
    })
    it('supports JWT', async () => {
      await getArchivist().get(`/archive/${archive}/settings/key`).auth(token, { type: 'bearer' }).expect(StatusCodes.OK)
    })
    it('supports API Key', async () => {
      const createKeyResponse = await createArchiveKey(token, archive)
      await getArchivist().get(`/archive/${archive}/settings/key`).set('x-api-key', createKeyResponse.key).expect(StatusCodes.OK)
    })
  })
  it('Returns the keys for the archive', async () => {
    const createKeyResponse = await createArchiveKey(token, archive)
    const response = await getArchiveKeys(token, archive)
    expect(response.length).toEqual(1)
    expect(response[0].key).toEqual(createKeyResponse.key)
  })
  it('Returns any empty array if there are no keys for the archive', async () => {
    const response = await getArchiveKeys(token, archive)
    expect(response).toEqual([])
  })
})
