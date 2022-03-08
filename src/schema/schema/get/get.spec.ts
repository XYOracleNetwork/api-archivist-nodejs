import { XyoBoundWitnessBuilder } from '@xyo-network/sdk-xyo-client-js'

import { getSchema, getSchemaName, postBlock } from '../../../test'

describe('/schema', () => {
  let schema = 'network.xyo.schema'
  beforeEach(async () => {
    const bwBuilder = new XyoBoundWitnessBuilder()
    const bw = bwBuilder
      .payload({
        definition: { $schema: 'http://json-schema.org/draft-07/schema#' },
        schema: 'network.xyo.schema',
      })
      .build()
    await postBlock(bw, 'temp')
    schema = getSchemaName()
  })
  it('Gets information about the schema', async () => {
    const response = await getSchema(schema)
    expect(response.schema).toEqual(schema)
  })
})
