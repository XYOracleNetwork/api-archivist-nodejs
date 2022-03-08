import { XyoBoundWitnessBuilder, XyoPayload } from '@xyo-network/sdk-xyo-client-js'

import { claimArchive, getArchivist, getTokenForNewUser } from '../../../test'

describe('/schema', () => {
  const schema = 'network.xyo.schema'
  const bwBuilder = new XyoBoundWitnessBuilder({ inlinePayloads: true })
  const bw = bwBuilder
    .payload({
      definition: { $schema: 'http://json-schema.org/draft-07/schema#' },
      schema,
    })
    .build()
  beforeEach(async () => {
    const token = await getTokenForNewUser()
    const archive = (await claimArchive(token)).archive
    await getArchivist()
      .post(`/archive/${archive}/block`)
      .send({ boundWitnesses: [bw] })
  })
  it('Check if payload wrote', async () => {
    const response = await getArchivist().get('/18f97b3e85f5bede65e7c0a85d74aee896de58ead8bc4b1b3d7300646c653057')
    const payload = (response.body as { data: XyoPayload }).data
    expect(payload.schema).toEqual(schema)
  })
  it('Gets information about the schema', async () => {
    const response = await getArchivist().get(`/schema/${schema}`)
    const payload = (response.body as { data: XyoPayload }).data
    expect(payload.schema).toEqual(schema)
  })
})
