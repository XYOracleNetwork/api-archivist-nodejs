import { StatusCodes } from 'http-status-codes'

import { claimArchive, getBlockWithPayloads, getRequest, getTokenForNewUser, postBlock } from '../../../../../testUtil'

const blocksPosted = 5

const postBlocksToArchive = async (archive: string, token: string, count = blocksPosted) => {
  for (let blockCount = 0; blockCount < count; blockCount++) {
    const block = getBlockWithPayloads()
    const blockResponse = await postBlock(block, archive)
    expect(blockResponse.length).toBe(1)
  }
}

describe('/archive/:archive/block/stats', () => {
  let token = ''
  let archive = ''
  beforeAll(async () => {
    // Post blocks to two different archives
    for (let i = 0; i < 2; i++) {
      token = await getTokenForNewUser()
      archive = (await claimArchive(token)).archive
      await postBlocksToArchive(archive, token)
    }
  }, 25000)
  it('Returns stats on the desired archive', async () => {
    const response = await (await getRequest()).get(`/archive/${archive}/block/stats`).expect(StatusCodes.OK)
    const stats = response.body.data
    expect(stats).toBeTruthy()
    expect(typeof stats?.count).toBe('number')
    expect(stats.count).toBe(blocksPosted)
  })
})
