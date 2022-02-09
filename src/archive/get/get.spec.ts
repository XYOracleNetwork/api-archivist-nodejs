import { claimArchive, getArchives, getTokenForNewUser } from '../../test'

describe('/archive', () => {
  let token = ''
  beforeEach(async () => {
    token = await getTokenForNewUser()
  })
  it('Returns the users archives', async () => {
    const claimArchiveResponse = await claimArchive(token)
    expect(await getArchives(token)).toEqual([claimArchiveResponse.archive])
  })
  it('Returns any empty array if the user owns no archives', async () => {
    expect(await getArchives(token)).toEqual([])
  })
})
