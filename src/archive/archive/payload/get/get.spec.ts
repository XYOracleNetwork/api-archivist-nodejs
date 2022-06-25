import { XyoPayload, XyoPayloadWithMeta } from '@xyo-network/sdk-xyo-client-js'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'

import { SortDirection } from '../../../../model'
import { claimArchive, getArchiveName, getArchivist, getNewBlockWithPayloads, getPayloadsByTimestamp, getRecentPayloads, getTokenForNewUser, postBlock } from '../../../../test'

const sortDirections: SortDirection[] = ['asc', 'desc']

describe('/archive/:archive/payload', () => {
  let token = ''
  let archive = ''
  let recentPayloads: XyoPayload[] = []
  beforeAll(async () => {
    token = await getTokenForNewUser()
    archive = getArchiveName()
    await claimArchive(token, archive)
    const blocksPosted = 25
    for (let blockCount = 0; blockCount < blocksPosted; blockCount++) {
      const block = getNewBlockWithPayloads()
      const blockResponse = await postBlock(block, archive)
      expect(blockResponse.length).toBe(1)
    }
    recentPayloads = await getRecentPayloads(archive, token)
    expect(recentPayloads).toBeTruthy()
    expect(Array.isArray(recentPayloads)).toBe(true)
    expect(recentPayloads.length).toBeGreaterThan(10)
  })
  it(`With missing timestamp returns ${ReasonPhrases.OK}`, async () => {
    await getArchivist().get(`/archive/${archive}/block`).query({ limit: 10, order: 'asc' }).auth(token, { type: 'bearer' }).expect(StatusCodes.OK)
  })
  describe('With valid data', () => {
    describe.each(sortDirections)('In %s order', (order: SortDirection) => {
      let hash = ''
      let timestamp = 0
      let response: XyoPayloadWithMeta[] = []
      let recentPayload: XyoPayloadWithMeta | undefined
      beforeEach(async () => {
        recentPayload = order === 'asc' ? recentPayloads.pop() : recentPayloads.shift()
        expect(recentPayload).toBeTruthy()
        hash = recentPayload?._hash || ''
        expect(hash).toBeTruthy()
        timestamp = recentPayload?._timestamp || 0
        expect(timestamp).toBeTruthy()
        response = await getPayloadsByTimestamp(token, archive, timestamp, 10, order)
        expect(response).toBeTruthy()
        expect(Array.isArray(response)).toBe(true)
        expect(response.length).toBe(10)
      })
      it('Returns blocks not including the specified timestamp', () => {
        expect(response.map((x) => x._timestamp)).not.toContain(timestamp)
      })
      it('Returns blocks in the correct sort order', () => {
        expect(response).toBeSortedBy('_timestamp', { descending: order === 'desc' })
      })
    })
  })
})
