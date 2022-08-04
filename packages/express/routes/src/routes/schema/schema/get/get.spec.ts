import { claimArchive, getHash, getSchema, getTokenForNewUser, postBlock } from '@xyo-network/archivist-test'
import { XyoSchemaPayload } from '@xyo-network/schema-payload-plugin'
import { XyoAccount, XyoBoundWitness, XyoBoundWitnessBuilder } from '@xyo-network/sdk-xyo-client-js'

describe('/schema/:schema', () => {
  const schema = 'network.xyo.schema'
  const definition = { $schema: 'http://json-schema.org/draft-07/schema#' }
  const bw = new XyoBoundWitnessBuilder<XyoBoundWitness, XyoSchemaPayload>({ inlinePayloads: true })
    .payload({ definition, schema })
    .witness(XyoAccount.random())
    .build()
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
    expect(response.definition.$schema).toEqual(definition.$schema)
  })
})
