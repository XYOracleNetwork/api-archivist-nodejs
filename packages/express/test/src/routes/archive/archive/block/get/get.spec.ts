import { SortDirection, XyoBoundWitnessWithMeta } from '@xyo-network/archivist-model'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'

import {
  claimArchive,
  getArchiveName,
  getBlock,
  getBlocksByTimestamp,
  getPayloads,
  getRecentBlocks,
  getTokenForUnitTestUser,
  postBlock,
  request,
} from '../../../../../testUtil'

const sortDirections: SortDirection[] = ['asc', 'desc']

describe('/archive/:archive/block', () => {
  let token = ''
  let archive = ''
  const startTime = Date.now()
  let stopTime = Date.now()
  beforeAll(async () => {
    token = await getTokenForUnitTestUser()
    archive = getArchiveName()
    await claimArchive(token, archive)
    const blocksPosted = 15
    for (let blockCount = 0; blockCount < blocksPosted; blockCount++) {
      const now = Date.now()
      const payloads = getPayloads(1)
      payloads[0].timestamp = now
      const block = getBlock(...payloads)
      block.timestamp = now
      const blockResponse = await postBlock(block, archive)
      expect(blockResponse.length).toBe(1)
    }
    const recentBlocks = await getRecentBlocks(archive, token)
    expect(recentBlocks).toBeTruthy()
    expect(Array.isArray(recentBlocks)).toBe(true)
    expect(recentBlocks.length).toBeGreaterThan(10)
    stopTime = Date.now()
    expect(stopTime).toBeGreaterThan(startTime)
  })
  it(`With missing timestamp returns ${ReasonPhrases.OK}`, async () => {
    await (await request()).get(`/archive/${archive}/block`).query({ limit: 10, order: 'asc' }).auth(token, { type: 'bearer' }).expect(StatusCodes.OK)
  })
  describe('With valid data', () => {
    describe.each(sortDirections)('In %s order', (order: SortDirection) => {
      let timestamp = 0
      let response: XyoBoundWitnessWithMeta[] = []
      beforeEach(async () => {
        timestamp = order === 'asc' ? startTime : stopTime
        expect(timestamp).toBeGreaterThan(0)
        response = await getBlocksByTimestamp(token, archive, timestamp, 10, order)
        expect(response).toBeTruthy()
        expect(Array.isArray(response)).toBe(true)
        expect(response.length).toBe(10)
      })
      it('Returns blocks not including the specified timestamp', () => {
        expect(response.map((x) => x.timestamp)).not.toContain(timestamp)
      })
      it('Returns blocks in the correct sort order', () => {
        expect(response).toBeSortedBy('timestamp', { descending: order === 'desc' })
      })
    })
  })
})
