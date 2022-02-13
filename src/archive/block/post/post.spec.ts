import { claimArchive, getArchiveName, getBlock, getTokenForNewUser, postBlock } from '../../../test'

describe('/archive/:archive/block', () => {
  it('Allows posting blocks to existing archives', async () => {
    const token = await getTokenForNewUser()
    const archive = (await claimArchive(token)).archive
    await postBlock(getBlock(), archive)
  })
  it('Allows posting blocks to non-existing archives', async () => {
    await postBlock(getBlock(), getArchiveName())
  })
  it('Allows posting without payload', async () => {
    await postBlock(getBlock(), getArchiveName())
  })
  it('Allows posting blocks to non-existing archives', async () => {
    await postBlock(getBlock(), getArchiveName())
  })
})
