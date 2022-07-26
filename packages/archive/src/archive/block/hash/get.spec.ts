import { claimArchive, getBlockByHash, getTokenForNewUser, knownBlock, knownBlockHash, postBlock } from '@xyo-network/archivist-test'

describe('/archive/:archive/block/hash/:hash', () => {
  let token = ''
  let archive = ''
  beforeEach(async () => {
    token = await getTokenForNewUser()
    archive = (await claimArchive(token)).archive
    await postBlock(knownBlock, archive)
  })
  it('Retrieves previously posted blocks by hash', async () => {
    const response = await getBlockByHash(token, archive, knownBlockHash)
    expect(response).toBeTruthy()
    expect(response.length).toBe(1)
    const block = response[0]
    expect(block).toBeTruthy()
    expect(typeof block._archive).toBe('string')
    expect(typeof block._hash).toBe('string')
    expect(typeof block._timestamp).toBe('number')
    expect(block._user_agent).toBe(null)
  })
  it('Allows retrieving the same block if posted to multiple archives', async () => {
    const response = await getBlockByHash(token, archive, knownBlockHash)
    expect(response.length).toBe(1)
    const token2 = await getTokenForNewUser()
    const archive2 = (await claimArchive(token2)).archive
    await postBlock(knownBlock, archive2)
    const response2 = await getBlockByHash(token2, archive2, knownBlockHash)
    expect(response2.length).toBe(1)
  })
})
