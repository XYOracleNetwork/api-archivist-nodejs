import { XyoPayload } from '@xyo-network/sdk-xyo-client-js'

import { claimArchive, getNewBlockWithPayloads, getRecentPayloads, getTokenForNewUser, postBlock } from '../../../../test'

const defaultReturnLength = 20

const getRecent = async (archive: string, token: string, expectedReturnLength = defaultReturnLength): Promise<XyoPayload[]> => {
  const recent = await getRecentPayloads(archive, token)
  expect(recent).toBeTruthy()
  expect(Array.isArray(recent)).toBe(true)
  expect(recent.length).toBe(expectedReturnLength)
  return recent
}

describe('/archive/:archive/payload/recent/:limit', () => {
  const payloadsToPost = defaultReturnLength + 5
  let token = ''
  let archive = ''
  beforeAll(async () => {
    token = await getTokenForNewUser()
    archive = (await claimArchive(token)).archive
    for (let i = 0; i < payloadsToPost; i++) {
      const response = await postBlock(getNewBlockWithPayloads(1), archive)
      expect(response.length).toBe(1)
    }
  })
  it(`With no argument, retrieves the ${defaultReturnLength} most recently posted payloads`, async () => {
    const recent = await getRecent(archive, token)
    recent.map((block) => expect(block._archive).toBe(archive))
  })
  it('Only retrieves recently posted payloads from the archive specified in the path', async () => {
    const otherPayloadsToPost = Math.ceil(defaultReturnLength / 2)
    // Post some payloads to other archives
    for (let i = 0; i < otherPayloadsToPost; i++) {
      const newArchive = (await claimArchive(token)).archive
      const response = await postBlock(getNewBlockWithPayloads(1), newArchive)
      expect(response.length).toBe(1)

      // Ensure this payload only shows up when getting recent from this archive
      const recent = await getRecent(newArchive, token, 1)
      recent.map((block) => expect(block._archive).toBe(newArchive))
    }
    // Ensure the original payloads only show up when getting recent from that archive
    const recent = await getRecent(archive, token)
    recent.map((block) => expect(block._archive).toBe(archive))
  })
  it('When no payloads have been posted to the archive, returns an empty array', async () => {
    await getRecent((await claimArchive(token)).archive, token, 0)
  })
})
