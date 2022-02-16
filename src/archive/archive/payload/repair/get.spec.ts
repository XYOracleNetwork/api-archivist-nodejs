import { claimArchive, getTokenForNewUser, postBlock, repairPayloadByHash } from '../../../../test'

const knownBlock = {
  boundWitnesses: [
    {
      _payloads: [
        {
          balance: 10000.0,
          daysOld: 1,
          deviceId: '00000000-0000-0000-0000-000000000000',
          geomines: 41453,
          planType: 'pro',
          schema: 'co.coinapp.current.user.witness',
          uid: '0000000000000000000000000000',
        },
      ],
    },
  ],
}
const knownPayloadHash = '9ba8f23d484191a50d7008e8bc93ef82e8253b66acf3e819cec7e39f17e4f1a8'

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
