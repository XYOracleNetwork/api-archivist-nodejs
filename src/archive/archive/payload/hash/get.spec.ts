import { claimArchive, getPayloadByHash, getTokenForNewUser, postBlock } from '../../../../test'

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
  it('Retrieves previously posted blocks by hash', async () => {
    const response = await getPayloadByHash(token, archive, knownPayloadHash)
    expect(response).toBeTruthy()
    expect(response.length).toBe(1)
    const block = response[0]
    expect(block).toBeTruthy()
    expect(typeof block._archive).toBe('string')
    expect(typeof block._hash).toBe('string')
    expect(typeof block._timestamp).toBe('number')
    expect(block._user_agent).toBe(undefined)
  })
  it('Allows retreiving the same block if posted to multiple archives', async () => {
    const response = await getPayloadByHash(token, archive, knownPayloadHash)
    expect(response.length).toBe(1)
    const token2 = await getTokenForNewUser()
    const archive2 = (await claimArchive(token2)).archive
    await postBlock(knownBlock, archive2)
    const response2 = await getPayloadByHash(token2, archive2, knownPayloadHash)
    expect(response2.length).toBe(1)
  })
})
