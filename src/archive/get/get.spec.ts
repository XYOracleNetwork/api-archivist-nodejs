import { claimArchive, getArchives, getTokenForNewUser } from '../../test'

describe('/archive', () => {
  let token = ''
  beforeEach(async () => {
    token = await getTokenForNewUser()
  })
  it('Returns the users archives', async () => {
    const claimArchiveResponse = await claimArchive(token)
    const response = await getArchives(token)
    expect(response.map((x) => x.archive)).toEqual([claimArchiveResponse.archive])
  })
  it('Returns any empty array if the user owns no archives', async () => {
    expect(await getArchives(token)).toEqual([])
  })
})

describe('/archive (noauth)', () => {
  it('Returns the users archives', async () => {
    const response = await getArchives()
    expect(response.map((x) => x.archive)).toEqual(['temp'])
  })
})
