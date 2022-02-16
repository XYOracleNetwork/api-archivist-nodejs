import { claimArchive, getArchive, getArchiveName, getTokenForNewUser } from '../../../test'

describe('/archive', () => {
  let token = ''
  let archive = ''
  beforeEach(async () => {
    token = await getTokenForNewUser()
    archive = getArchiveName()
    await claimArchive(token, archive)
  })
  it('Gets information about the archive', async () => {
    const response = await getArchive(token, archive)
    expect(response.archive).toEqual(archive)
  })
})
