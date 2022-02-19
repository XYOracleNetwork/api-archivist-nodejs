import {
  claimArchive,
  getArchiveName,
  getBlocksByHash,
  getNewBlockWithPayloads,
  getRecentBlocks,
  getTokenForNewUser,
  postBlock,
} from '../../../../test'

describe('/archive/:archive/block', () => {
  let token = ''
  let archive = ''
  beforeEach(async () => {
    token = await getTokenForNewUser()
    archive = getArchiveName()
    await claimArchive(token, archive)
    const blocksPosted = 25
    for (let blockCount = 0; blockCount < blocksPosted; blockCount++) {
      const block = getNewBlockWithPayloads()
      const blockResponse = await postBlock(block, archive)
      expect(blockResponse.boundWitnesses).toBe(1)
    }
  })
  it('Returns blocks after the specified hash', async () => {
    const recent = await getRecentBlocks(token, archive)
    expect(recent).toBeTruthy()
    expect(Array.isArray(recent)).toBe(true)
    expect(recent.length).toBeGreaterThan(0)
    recent.sort((a, b) => {
      if (!a?._hash && !b?._hash) {
        return 1
      }
      if (!a?._hash) return -1
      if (!b?._hash) return 1
      return a._hash > b._hash ? 1 : -1
    })
    const recentHash = recent[0]._hash || ''
    expect(recentHash).toBeTruthy()
    const response = await getBlocksByHash(token, archive, recentHash)
    expect(response).toBeTruthy()
    expect(Array.isArray(response)).toBe(true)
    expect(response.length).toBeGreaterThan(0)
  })
})
