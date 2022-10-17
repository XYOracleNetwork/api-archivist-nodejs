import { XyoBoundWitness } from '@xyo-network/boundwitness'

import { claimArchive, getBlockWithPayloads, getRecentBlocks, getTokenForUnitTestUser, postBlock } from '../../../../testUtil'

const defaultReturnLength = 10

const getAddressBoundWitnesses = async (address: string, token: string, expectedReturnLength = defaultReturnLength): Promise<XyoBoundWitness[]> => {
  const recent = await getRecentBlocks(address, token)
  expect(recent).toBeTruthy()
  expect(Array.isArray(recent)).toBe(true)
  expect(recent.length).toBe(expectedReturnLength)
  return recent
}

describe('/address/:address/boundwitness', () => {
  const blocksToPost = defaultReturnLength + 5
  const otherBlocksToPost = Math.ceil(defaultReturnLength / 2)
  let token = ''
  let archive = ''
  let otherArchive = ''
  beforeAll(async () => {
    token = await getTokenForUnitTestUser()
    archive = (await claimArchive(token)).archive
    otherArchive = (await claimArchive(token)).archive

    // NOTE: POST in parallel to speed up test
    const posted = new Array(blocksToPost).fill(null).map(async () => {
      const response = await postBlock(getBlockWithPayloads(1), archive)
      expect(response.length).toBe(1)
    })
    await Promise.all(posted)
  })
  it(`With no argument, retrieves the ${defaultReturnLength} most recently posted blocks`, async () => {
    // Ensure the original payloads only show up when getting recent from that archive
    const recent = await getAddressBoundWitnesses(archive, token)
    recent.map((block) => expect(block.addresses).toContain(archive))
  })
  it('Only retrieves recently posted blocks from the archive specified in the path', async () => {
    // Ensure the original blocks only show up when getting recent from that archive
    const recent = await getAddressBoundWitnesses(otherArchive, token, otherBlocksToPost)
    recent.map((block) => expect(block.addresses).toContain(otherArchive))
  })
  it('When no blocks have been posted to the archive, returns an empty array', async () => {
    await getAddressBoundWitnesses((await claimArchive(token)).archive, token, 0)
  })
})
