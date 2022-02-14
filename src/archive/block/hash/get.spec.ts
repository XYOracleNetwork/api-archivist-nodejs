import { claimArchive, getBlockByHash, getTokenForNewUser, postBlock } from '../../../test'

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
const knownBlockHash = '44136fa355b3678a1146ad16f7e8649e94fb4fc21fe77e8310c060f61caaff8a'

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
  it('Allows retreiving the same block if posted to multiple archives', async () => {
    const response = await getBlockByHash(token, archive, knownBlockHash)
    expect(response.length).toBe(1)
    const token2 = await getTokenForNewUser()
    const archive2 = (await claimArchive(token2)).archive
    await postBlock(knownBlock, archive2)
    const response2 = await getBlockByHash(token2, archive2, knownBlockHash)
    expect(response2.length).toBe(1)
  })
})
