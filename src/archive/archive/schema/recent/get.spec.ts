import { XyoAccount, XyoBoundWitnessBuilder } from '@xyo-network/sdk-xyo-client-js'

import { claimArchive, getArchiveSchemaRecent, getTokenForNewUser, postBlock } from '../../../../test'

describe('/archive/:archive/schema/recent', () => {
  const schema = 'network.xyo.schema'
  const definition = { $schema: 'http://json-schema.org/draft-07/schema#' }
  const schemaToAdd = 5
  let token: string
  let archive: string
  beforeAll(async () => {
    token = await getTokenForNewUser()
    archive = (await claimArchive(token)).archive
    for (let i = 0; i < schemaToAdd; i++) {
      const bw = new XyoBoundWitnessBuilder({ inlinePayloads: true }).payload({ definition, schema }).witness(XyoAccount.random()).build()
      const response = await postBlock(bw, archive)
      expect(response).toBeTruthy()
    }
  })
  it('Gets recently uploaded schema for the archive', async () => {
    const response = await getArchiveSchemaRecent(archive)
    expect(response).toBeTruthy()
    expect(Array.isArray(response)).toBeTruthy()
    expect(response.length).toBe(schemaToAdd)
    response.forEach((payload) => {
      expect(payload._archive).toBe(archive)
      expect(payload.schema).toBe(schema)
      expect(payload.definition).toStrictEqual(definition)
    })
  })
})
