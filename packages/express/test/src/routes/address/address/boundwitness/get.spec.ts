import { BoundWitnessWrapper, XyoBoundWitness } from '@xyo-network/boundwitness'
import { StatusCodes } from 'http-status-codes'

import { claimArchive, getBlockWithPayloads, getTokenForUnitTestUser, postBlock, request, unitTestSigningAccount } from '../../../../testUtil'

const defaultReturnLength = 10
const unitTestAddress = unitTestSigningAccount.addressValue.hex

const getAddressHistory = async (address: string = unitTestAddress, limit?: number, offset?: string): Promise<XyoBoundWitness[]> => {
  const query: { limit?: number; offset?: string } = {}
  if (limit) query.limit = limit
  if (offset) query.offset = offset
  const result = await (await request()).get(`/address/${address}/boundwitness`).query(query).expect(StatusCodes.OK)
  const history = result.body.data
  expect(history).toBeTruthy()
  expect(Array.isArray(history)).toBe(true)
  return history
}

describe('/address/:address/boundwitness', () => {
  const blocksToPost = defaultReturnLength + 5
  let token = ''
  let archive = ''
  const blocks: XyoBoundWitness[] = []
  beforeAll(async () => {
    token = await getTokenForUnitTestUser()
    archive = (await claimArchive(token)).archive
    for (let i = 0; i < blocksToPost; i++) {
      const block = getBlockWithPayloads(1)
      blocks.push(block)
      const response = await postBlock(block, archive)
      expect(response.length).toBe(1)
    }
  })
  describe('limit', () => {
    describe('with no limit supplied', () => {
      it(`retrieves ${defaultReturnLength} blocks`, async () => {
        const history = await getAddressHistory()
        expect(history.length).toBe(defaultReturnLength)
      })
    })
    describe('with limit supplied', () => {
      it('retrieves the number of blocks equal to the supplied limit', async () => {
        const limit = defaultReturnLength / 2
        const history = await getAddressHistory(unitTestAddress, limit)
        expect(history.length).toBe(limit)
      })
    })
  })
  describe('offset', () => {
    describe('with valid offset', () => {
      const limit = blocks.length / 2
      const offset = new BoundWitnessWrapper(blocks[limit]).hash
      it('returns bound witnesses from the offset specified', async () => {
        const history = await getAddressHistory(unitTestAddress, limit, offset)
        expect(history.length).toBe(limit)
        history.map((block) => expect(block.addresses).toContain(unitTestAddress))
      })
      it('returns a block chain in sequential order', async () => {
        const history = await getAddressHistory(unitTestAddress, limit, offset)
        expect(history.length).toBe(limit)
        verifyBlockChainHistory(history)
      })
    })
    describe('with non-existent offset', () => {
      it('returns an empty array', async () => {
        const history = await getAddressHistory(unitTestAddress, defaultReturnLength, 'foo')
        expect(history.length).toBe(0)
      })
    })
  })
  describe('address', () => {
    describe('with valid address', () => {
      it('returns bound witnesses from the address specified', async () => {
        const history = await getAddressHistory()
        history.map((block) => expect(block.addresses).toContain(unitTestAddress))
      })
      it('returns a block chain in sequential order', async () => {
        const history = await getAddressHistory()
        verifyBlockChainHistory(history)
      })
    })
    describe('with non-existent address', () => {
      it('returns an empty array', async () => {
        const history = await getAddressHistory('foo')
        expect(history.length).toBe(0)
      })
    })
  })
})

const verifyBlockChainHistory = (history: XyoBoundWitness[]) => {
  for (let i = 1; i < history.length; i++) {
    const current = history[i - 1]
    const previous = history[i]
    expect(current.previous_hashes).toContain(new BoundWitnessWrapper(previous).hash)
  }
}
