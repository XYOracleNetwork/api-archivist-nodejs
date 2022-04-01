import { StatusCodes } from 'http-status-codes'

import { claimArchive, getArchivist, getNewBlockWithPayloads, getTokenForNewUser, postBlock } from '../../../../test'

const blocksPosted = 25

describe('/archive/:archive/block/stats', () => {
  let token = ''
  let archive = ''
  beforeAll(async () => {
    token = await getTokenForNewUser()
    archive = (await claimArchive(token)).archive
    // Post blocks to one archive
    for (let blockCount = 0; blockCount < blocksPosted; blockCount++) {
      const block = getNewBlockWithPayloads()
      const blockResponse = await postBlock(block, archive)
      expect(blockResponse.length).toBe(1)
    }

    // Post blocks to another archive
    token = await getTokenForNewUser()
    archive = (await claimArchive(token)).archive
    for (let blockCount = 0; blockCount < blocksPosted; blockCount++) {
      const block = getNewBlockWithPayloads()
      const blockResponse = await postBlock(block, archive)
      expect(blockResponse.length).toBe(1)
    }
  }, 25000)
  it('Returns stats on all archives', async () => {
    // Verify the counts are for more than just 1 archive
    const response = await getArchivist()
      .get(`/archive/${archive}/block/stats`)
      .auth(token, { type: 'bearer' })
      .expect(StatusCodes.OK)
    const stats = response.body.data
    expect(stats).toBeTruthy()
    expect(typeof stats?.count).toBe('number')
    expect(stats.count).toBeGreaterThanOrEqual(2 * blocksPosted)
  })
})
