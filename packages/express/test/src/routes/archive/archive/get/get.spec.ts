import { claimArchive, getArchive, getArchiveName, getTokenForNewUser } from '../../../../testUtil'

describe('/archive', () => {
  let token = ''
  let archive = ''
  beforeEach(async () => {
    token = await getTokenForNewUser()
    archive = getArchiveName()
    await claimArchive(token, archive)
  })
  it('Gets information about the archive', async () => {
    const response = await getArchive(archive, token)
    expect(response.archive).toEqual(archive)
  })
})
