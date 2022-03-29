import {
  claimArchive,
  getArchiveName,
  getNewBlock,
  getNewBlockWithBoundWitnesses,
  getNewBlockWithBoundWitnessesWithPayloads,
  getNewBlockWithPayloads,
  getPayloads,
  getTokenForNewUser,
  postBlock,
} from '../../../../test'

describe('/archive/:archive/block', () => {
  describe('allows posting block', () => {
    let token = ''
    let archive = ''
    beforeAll(async () => {
      token = await getTokenForNewUser()
      archive = (await claimArchive(token)).archive
    })
    it('to existing archive', async () => {
      await postBlock(getNewBlock(), archive)
    })
    it('to non-existing archives', async () => {
      await postBlock(getNewBlock(), getArchiveName())
    })
    it('with single payload', async () => {
      const response = await postBlock(getNewBlockWithPayloads(1), archive)
      expect(response.length).toEqual(1)
    })
    it('with multiple payloads', async () => {
      const response = await postBlock(getNewBlockWithPayloads(2), archive)
      expect(response.length).toEqual(1)
    })
    it('without payloads', async () => {
      const response = await postBlock(getNewBlock(), archive)
      expect(response.length).toEqual(1)
    })
    it('with multiple bound witnesses', async () => {
      const response = await postBlock(getNewBlockWithBoundWitnesses(2), archive)
      expect(response.length).toEqual(2)
    })
    it('with multiple bound witnesses with payloads', async () => {
      const response = await postBlock(getNewBlockWithBoundWitnessesWithPayloads(2), archive)
      expect(response.length).toEqual(2)
    })
    it('with multiple bound witnesses with multiple payloads', async () => {
      const response = await postBlock(getNewBlockWithBoundWitnessesWithPayloads(2, 2), archive)
      expect(response.length).toEqual(2)
    })
    it('with multiple bound witnesses some with payloads and some without', async () => {
      const boundWitness1 = getNewBlock(...getPayloads(2))
      const boundWitness2 = getNewBlock()
      const block = [boundWitness1, boundWitness2]
      const response = await postBlock(block, archive)
      expect(response.length).toEqual(2)
    })
  })
})
