import { claimArchive, getArchiveName, getTokenForNewUser } from '../../../../test'

describe.skip('/archive/:archive/payload', () => {
  let token = ''
  let archive = ''
  beforeEach(async () => {
    token = await getTokenForNewUser()
    archive = getArchiveName()
    await claimArchive(token, archive)
  })
  it('Needs tests', async () => {
    // TODO: Tests
  })
})
