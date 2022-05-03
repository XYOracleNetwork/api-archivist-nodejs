import { v4 } from 'uuid'

import { claimArchive, getArchiveSchemaPayloadsRecent, getNewBlock, getNewBlockWithPayloads, getPayloads, getTokenForNewUser, postBlock } from '../../../../test'

describe('/archive/:archive/schema/:schema/recent', () => {
  const schema = `network.xyo.test.${v4()}`
  const schemaToAdd = 5
  let token: string
  let archive: string
  beforeAll(async () => {
    token = await getTokenForNewUser()
    archive = (await claimArchive(token)).archive
    for (let i = 0; i < schemaToAdd; i++) {
      const payloads = getPayloads(1)
      expect(payloads).toBeTruthy()
      expect(payloads?.length).toBe(1)
      expect(payloads?.[0]).toBeTruthy()
      expect(payloads?.[0]?.schema).toBeTruthy()
      if (payloads?.[0]?.schema) {
        payloads[0].schema = schema
      }
      const block = getNewBlock(...payloads)
      block._archive = archive
      block.payload_schemas = [schema]
      const response = await postBlock(block, archive)
      expect(response).toBeTruthy()
    }
  })
  it('Gets recently uploaded payloads with the supplied schema from the archive', async () => {
    const response = await getArchiveSchemaPayloadsRecent(archive, schema)
    expect(response).toBeTruthy()
    expect(Array.isArray(response)).toBeTruthy()
    expect(response.length).toBe(schemaToAdd)
    response.forEach((payload) => {
      expect(payload._archive).toBe(archive)
      expect(payload.schema).toBe(schema)
    })
  })
})
