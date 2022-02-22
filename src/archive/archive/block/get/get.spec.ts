import { XyoBoundWitness } from '@xyo-network/sdk-xyo-client-js'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'

import { SortDirection } from '../../../../model'
import {
  claimArchive,
  getArchiveName,
  getBlocksByHash,
  getNewBlockWithPayloads,
  getRecentBlocks,
  getTokenForNewUser,
  postBlock,
} from '../../../../test'

const sortDirections: SortDirection[] = ['asc', 'desc']

const ascendingSort = (a: XyoBoundWitness, b: XyoBoundWitness) => {
  if (!a?._timestamp && !b?._timestamp) {
    return 1
  }
  if (!a?._timestamp) return -1
  if (!b?._timestamp) return 1
  return a._timestamp > b._timestamp ? 1 : -1
}
const descendingSort = (a: XyoBoundWitness, b: XyoBoundWitness) => {
  if (!a?._timestamp && !b?._timestamp) {
    return -1
  }
  if (!a?._timestamp) return 1
  if (!b?._timestamp) return -1
  return a._timestamp > b._timestamp ? -1 : 1
}

describe('/archive/:archive/block', () => {
  let token = ''
  let archive = ''
  beforeEach(async () => {
    token = await getTokenForNewUser()
    archive = getArchiveName()
    await claimArchive(token, archive)
  })
  it(`With non-existent hash returns ${ReasonPhrases.NOT_FOUND}`, async () => {
    await getBlocksByHash(token, archive, '1234567890', 10, 'asc', StatusCodes.NOT_FOUND)
  })
  it(`With missing hash returns ${ReasonPhrases.BAD_REQUEST}`, async () => {
    await getBlocksByHash(token, archive, '', 10, 'asc', StatusCodes.BAD_REQUEST)
  })
  describe('With valid data', () => {
    let recentBlocks: XyoBoundWitness[] = []
    beforeEach(async () => {
      const blocksPosted = 25
      for (let blockCount = 0; blockCount < blocksPosted; blockCount++) {
        const block = getNewBlockWithPayloads()
        const blockResponse = await postBlock(block, archive)
        expect(blockResponse.boundWitnesses).toBe(1)
      }
      recentBlocks = await getRecentBlocks(token, archive)
      expect(recentBlocks).toBeTruthy()
      expect(Array.isArray(recentBlocks)).toBe(true)
      expect(recentBlocks.length).toBeGreaterThan(10)
    })
    describe.each(sortDirections)('In %s order', (order: SortDirection) => {
      const sortPredicate = order === 'asc' ? ascendingSort : descendingSort
      let recentHash = ''
      let response: XyoBoundWitness[] = []
      beforeEach(async () => {
        recentHash = (order === 'asc' ? recentBlocks.pop() : recentBlocks.shift())?._hash || ''
        expect(recentHash).toBeTruthy()
        response = await getBlocksByHash(token, archive, recentHash, 10, order)
        expect(response).toBeTruthy()
        expect(Array.isArray(response)).toBe(true)
        expect(response.length).toBe(10)
      })
      it('Returns blocks starting at the specified hash', () => {
        expect(response.map((x) => x._hash)).toContain(recentHash)
      })
      it('Returns blocks in the correct sort order', () => {
        expect([...response].sort(sortPredicate)).toEqual(response)
      })
    })
  })
})
