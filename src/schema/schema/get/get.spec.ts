import { XyoBoundWitnessBuilder } from '@xyo-network/sdk-xyo-client-js'

import { claimArchive, getHash, getSchema, getTokenForNewUser, postBlock } from '../../../test'

describe('/schema', () => {
  const schema = 'network.xyo.schema'
  const definition = { $schema: 'http://json-schema.org/draft-07/schema#' }
  const bw = new XyoBoundWitnessBuilder({ inlinePayloads: true }).payload({ definition, schema }).build()
  beforeAll(async () => {
    const token = await getTokenForNewUser()
    const archive = (await claimArchive(token)).archive
    await postBlock(bw, archive)
    const payloadHash = bw.payload_hashes[0]
    expect(payloadHash).toBeTruthy()
    const response = await getHash(payloadHash)
    expect(response).toBeTruthy()
    expect(response.schema).toEqual(schema)
  })

  it('Gets information about the schema', async () => {
    const response = await getSchema(schema)
    expect(response).toBeTruthy()
    expect(response.schema).toEqual(schema)
    expect(response.definition).toEqual(definition)
  })
})
