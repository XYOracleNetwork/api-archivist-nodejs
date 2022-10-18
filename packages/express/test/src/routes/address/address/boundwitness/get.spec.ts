import { XyoBoundWitness } from '@xyo-network/boundwitness'
import { StatusCodes } from 'http-status-codes'

import { claimArchive, getBlockWithPayloads, getTokenForUnitTestUser, postBlock, request, unitTestSigningAccount } from '../../../../testUtil'

const defaultReturnLength = 10
const address = unitTestSigningAccount.addressValue.hex

const getAddressBoundWitnesses = async (expectedReturnLength = defaultReturnLength): Promise<XyoBoundWitness[]> => {
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
  it(`With no argument, retrieves the ${defaultReturnLength} most recently posted blocks`, async () => {
    // Ensure the original payloads only show up when getting recent from that archive
    const recent = await getAddressBoundWitnesses()
    recent.map((block) => expect(block.addresses).toContain(address))
  })
  it('Only retrieves recently posted blocks from the address specified in the path', async () => {
    // Ensure the original blocks only show up when getting recent from that archive
    const recent = await getAddressBoundWitnesses()
    recent.map((block) => expect(block.addresses).toContain(address))
  })
})
