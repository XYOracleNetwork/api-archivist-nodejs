import { claimArchive, getPayloadByBlockHash, getTokenForNewUser, postBlock } from '../../../../test'

describe.skip('/archive/:archive/block/hash/:hash/payloads', () => {
  let token = ''
  let archive = ''
  beforeEach(async () => {
    token = await getTokenForNewUser()
    archive = (await claimArchive(token)).archive
  })
  it('Retrieves the single payload for the specified block hash', async () => {
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
    await postBlock(knownBlock, archive)
    const response = await getPayloadByBlockHash(token, archive, knownBlockHash)
    expect(response).toBeTruthy()
    expect(response.length).toBe(1)
    const payloads = response[0]
    expect(payloads).toBeTruthy()
  })
  it('Retrieves the array of payloads for the specified block hash', async () => {
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
    await postBlock(knownBlock, archive)
    const response = await getPayloadByBlockHash(token, archive, knownBlockHash)
    expect(response).toBeTruthy()
    expect(response.length).toBe(2)
    const block = response[0]
    expect(block).toBeTruthy()
  })
  it('Returns an empty array if no payload was posted for the specified block hash', async () => {
    const knownBlock = {
      boundWitnesses: [
        {
          _payloads: [],
        },
      ],
    }
    const knownBlockHash = '44136fa355b3678a1146ad16f7e8649e94fb4fc21fe77e8310c060f61caaff8a'
    await postBlock(knownBlock, archive)
    const response = await getPayloadByBlockHash(token, archive, knownBlockHash)
    expect(response).toBeTruthy()
    expect(response.length).toBe(0)
  })
})
