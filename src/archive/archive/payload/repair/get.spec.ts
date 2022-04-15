import { claimArchive, getTokenForNewUser, knownBlock, knownPayloadHash, postBlock, repairPayloadByHash } from '../../../../test'

describe('/archive/:archive/block/payload/:hash', () => {
  let token = ''
  let archive = ''
  beforeEach(async () => {
    token = await getTokenForNewUser()
    archive = (await claimArchive(token)).archive
    await postBlock(knownBlock, archive)
  })
  it('Repairs previously posted payloads by hash', async () => {
    const response = await repairPayloadByHash(token, archive, knownPayloadHash)
    expect(response).toBeTruthy()
    expect(response.acknowledged).toBe(true)
    expect(response.matchedCount).toBe(1)
    expect(response.modifiedCount).toBe(0)
    expect(response.upsertedCount).toBe(0)
    // expect(response.upsertedId).toBe(null)
  })
})
