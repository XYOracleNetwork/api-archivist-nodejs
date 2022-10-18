import { XyoBoundWitness } from '@xyo-network/boundwitness'
import { StatusCodes } from 'http-status-codes'

import { claimArchive, getBlockWithPayloads, getTokenForUnitTestUser, postBlock, request, unitTestSigningAccount } from '../../../../testUtil'

const defaultReturnLength = 10
const unitTestAddress = unitTestSigningAccount.addressValue.hex

const getAddressHistory = async (address: string = unitTestAddress, expectedReturnLength = defaultReturnLength): Promise<XyoBoundWitness[]> => {
  const result = await (await request()).get(`/address/${address}/boundwitness`).query({ limit: 10 }).expect(StatusCodes.OK)
  const history = result.body.data
  expect(history).toBeTruthy()
  expect(Array.isArray(history)).toBe(true)
  expect(history.length).toBe(expectedReturnLength)
  return history
}

describe('/address/:address/boundwitness', () => {
  const blocksToPost = defaultReturnLength + 5
  let token = ''
  let archive = ''
  beforeAll(async () => {
    token = await getTokenForUnitTestUser()
    archive = (await claimArchive(token)).archive
    for (let i = 0; i < blocksToPost; i++) {
      const response = await postBlock(getBlockWithPayloads(1), archive)
      expect(response.length).toBe(1)
    }
  })
  describe('limit', () => {
    it(`With no argument supplied, retrieves the ${defaultReturnLength} most recently posted blocks`, async () => {
      const recent = await getAddressHistory()
      recent.map((block) => expect(block.addresses).toContain(unitTestAddress))
    })
  })
  describe('address', () => {
    it('with valid address, returns bound witnesses from the address specified', async () => {
      const recent = await getAddressHistory()
      recent.map((block) => expect(block.addresses).toContain(unitTestAddress))
    })
    it('with non-existent address, returns an empty array', async () => {
      await getAddressHistory('foo', 0)
    })
  })
})
