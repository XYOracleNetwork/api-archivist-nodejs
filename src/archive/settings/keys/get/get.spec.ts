import { StatusCodes } from 'http-status-codes'

import { claimArchive, createArchiveKey, getArchivist, getTokenForNewUser } from '../../../../test'

describe('/archive/:archive/settings/keys', () => {
  let token = ''
  let archive = ''
  beforeEach(async () => {
    token = await getTokenForNewUser()
    archive = (await claimArchive(token)).archive
  })
  it('Returns the keys for the archive', async () => {
    const createKeyResponse = await createArchiveKey(token, archive)
    const response = await getArchivist()
      .get(`/archive/${archive}/settings/keys`)
      .auth(token, { type: 'bearer' })
      .expect(StatusCodes.OK)
    expect(response.body).toEqual([createKeyResponse.key])
  })
  it('Returns any empty array if there are no keys for the archive', async () => {
    const response = await getArchivist()
      .get(`/archive/${archive}/settings/keys`)
      .auth(token, { type: 'bearer' })
      .expect(StatusCodes.OK)
    expect(response.body).toEqual([])
  })
})
