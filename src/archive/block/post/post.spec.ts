import {
  claimArchive,
  getArchiveName,
  getNewBlock,
  getNewBlockWithBoundWitnesses,
  getNewBlockWithBoundWitnessesWithPayloads,
  getNewBlockWithPayloads,
  getTokenForNewUser,
  postBlock,
} from '../../../test'

describe('/archive/:archive/block', () => {
  it('Allows posting blocks to existing archives', async () => {
    const token = await getTokenForNewUser()
    const archive = (await claimArchive(token)).archive
    await postBlock(getNewBlock(), archive)
  })
  it('Allows posting blocks to non-existing archives', async () => {
    await postBlock(getNewBlock(), getArchiveName())
  })
  it('Allows posting block with payload', async () => {
    const response = await postBlock(getNewBlockWithPayloads(1), getArchiveName())
    expect(response.boundWitnesses).toEqual(1)
    expect(response.payloads).toEqual(1)
  })
  it('Allows posting block with multiple payload', async () => {
    const response = await postBlock(getNewBlockWithPayloads(2), getArchiveName())
    expect(response.boundWitnesses).toEqual(1)
    expect(response.payloads).toEqual(2)
  })
  it('Allows posting block without payloads', async () => {
    const response = await postBlock(getNewBlock(), getArchiveName())
    expect(response.boundWitnesses).toEqual(1)
    expect(response.payloads).toEqual(0)
  })
  it('Allows posting block with multiple bound witnesses', async () => {
    const response = await postBlock(getNewBlockWithBoundWitnesses(2), getArchiveName())
    expect(response.boundWitnesses).toEqual(2)
    expect(response.payloads).toEqual(0)
  })
  it('Allows posting block with multiple bound witnesses with payloads', async () => {
    const response = await postBlock(getNewBlockWithBoundWitnessesWithPayloads(2), getArchiveName())
    expect(response.boundWitnesses).toEqual(2)
    expect(response.payloads).toEqual(2)
  })
  it('Allows posting block with multiple bound witnesses with multiple payloads', async () => {
    const response = await postBlock(getNewBlockWithBoundWitnessesWithPayloads(2, 2), getArchiveName())
    expect(response.boundWitnesses).toEqual(2)
    expect(response.payloads).toEqual(4)
  })
  it('Allows posting multiple bound witnesses some with payloads and some without', async () => {
    const block = getNewBlockWithBoundWitnessesWithPayloads(2, 2)
    block.boundWitnesses[0]._payloads = []
    const response = await postBlock(block, getArchiveName())
    expect(response.boundWitnesses).toEqual(2)
    expect(response.payloads).toEqual(2)
  })
})
