import { XyoBoundWitnessWithMeta } from '@xyo-network/archivist-model'

import { claimArchive, getBlockWithPayloads, getRecentBlocks, getTokenForUnitTestUser, postBlock } from '../../../../../testUtil'

const defaultReturnLength = 20

const getRecent = async (archive: string, token: string, expectedReturnLength = defaultReturnLength): Promise<XyoBoundWitnessWithMeta[]> => {
  const recent = await getRecentBlocks(archive, token)
  expect(recent).toBeTruthy()
  expect(Array.isArray(recent)).toBe(true)
  expect(recent.length).toBe(expectedReturnLength)
  return recent
}

describe('/archive/:archive/block/recent/:limit', () => {
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
    const posted = [
      // POST Payloads to test archive
      new Array(blocksToPost).fill(null).map(async () => {
        const response = await postBlock(getBlockWithPayloads(1), archive)
        expect(response.length).toBe(1)
      }),
      // Post some payloads to another archive
      new Array(otherBlocksToPost).fill(null).map(async () => {
        const response = await postBlock(getBlockWithPayloads(1), otherArchive)
        expect(response.length).toBe(1)
      }),
    ]
    await Promise.all(posted.flatMap((p) => p))
  })
  it(`With no argument, retrieves the ${defaultReturnLength} most recently posted blocks`, async () => {
    // Ensure the original payloads only show up when getting recent from that archive
    const recent = await getRecent(archive, token)
    recent.map((block) => expect(block._archive).toBe(archive))
  })
  it('Only retrieves recently posted blocks from the archive specified in the path', async () => {
    // Ensure the original blocks only show up when getting recent from that archive
    const recent = await getRecent(otherArchive, token, otherBlocksToPost)
    recent.map((block) => expect(block._archive).toBe(otherArchive))
  })
  it('When no blocks have been posted to the archive, returns an empty array', async () => {
    await getRecent((await claimArchive(token)).archive, token, 0)
  })
})
