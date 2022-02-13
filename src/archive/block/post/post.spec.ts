import {
  claimArchive,
  getArchiveName,
  getBlock,
  getBlockWithPayloads,
  getTokenForNewUser,
  postBlock,
} from '../../../test'

describe('/archive/:archive/block', () => {
  it('Allows posting blocks to existing archives', async () => {
    const token = await getTokenForNewUser()
    const archive = (await claimArchive(token)).archive
    await postBlock(getBlock(), archive)
  })
  it('Allows posting blocks to non-existing archives', async () => {
    await postBlock(getBlock(), getArchiveName())
  })
  it('Allows posting block with payload', async () => {
    const response = await postBlock(getBlockWithPayloads(1), getArchiveName())
    expect(response.boundWitnesses).toEqual(1)
    expect(response.payloads).toEqual(1)
  })
  it('Allows posting block with multiple payload', async () => {
    const response = await postBlock(getBlockWithPayloads(2), getArchiveName())
    expect(response.boundWitnesses).toEqual(1)
    expect(response.payloads).toEqual(2)
  })
  it('Allows posting block without payloads', async () => {
    const response = await postBlock(getBlock(), getArchiveName())
    expect(response.boundWitnesses).toEqual(1)
    expect(response.payloads).toEqual(0)
  })
})
