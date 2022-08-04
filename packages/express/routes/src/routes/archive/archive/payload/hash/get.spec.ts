import { claimArchive, getPayloadByHash, getTokenForNewUser, knownBlock, knownPayloadHash, postBlock } from '@xyo-network/archivist-test'

describe('/archive/:archive/block/payload/:hash', () => {
  let token = ''
  let archive = ''
  beforeEach(async () => {
    token = await getTokenForNewUser()
    archive = (await claimArchive(token)).archive
    await postBlock(knownBlock, archive)
  })
  it('Retrieves previously posted payloads by hash', async () => {
    const response = await getPayloadByHash(token, archive, knownPayloadHash)
    expect(response).toBeTruthy()
    expect(response.length).toBe(1)
    const block = response[0]
    expect(block).toBeTruthy()
    expect(block._user_agent).toBe(undefined)
  })
  it('Allows retrieving the same payload if posted to multiple archives', async () => {
    const response = await getPayloadByHash(token, archive, knownPayloadHash)
    expect(response.length).toBe(1)
    const token2 = await getTokenForNewUser()
    const archive2 = (await claimArchive(token2)).archive
    await postBlock(knownBlock, archive2)
    const response2 = await getPayloadByHash(token2, archive2, knownPayloadHash)
    expect(response2.length).toBe(1)
  })
})
