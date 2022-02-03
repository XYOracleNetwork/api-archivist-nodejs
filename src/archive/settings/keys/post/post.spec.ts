import { claimArchive, createArchiveKey, getTokenForNewUser } from '../../../../test'

describe('/archive/:archive/settings/keys', () => {
  let token = ''
  let archive = ''
  beforeEach(async () => {
    token = await getTokenForNewUser()
    archive = (await claimArchive(token)).archive
  })
  it('Creates a key for the archive', async () => {
    const response = await createArchiveKey(token, archive)
    expect(response).toBeTruthy()
    expect(response.key).toBeTruthy()
    expect(response.key).toBeInstanceOf('string')
  })
})
