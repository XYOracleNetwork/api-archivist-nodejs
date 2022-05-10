import { XyoAccount, XyoBoundWitnessBuilder } from '@xyo-network/sdk-xyo-client-js'
import { StatusCodes } from 'http-status-codes'
import { v4 } from 'uuid'

import { claimArchive, getArchivist, getTokenForNewUser, postBlock } from '../../../../../test'

const blocksPosted = 2
const definition = { $schema: 'http://json-schema.org/draft-07/schema#' }

const getNewBlockWithPayloadsOfSchemaType = (schema = `network.xyo.schema.test.${v4()}`) => {
  return new XyoBoundWitnessBuilder({ inlinePayloads: true }).payload({ definition, schema }).witness(XyoAccount.random()).build()
}

describe('/archive/:archive/payload/schema/stats', () => {
  let token = ''
  let archive = ''
  beforeAll(async () => {
    token = await getTokenForNewUser()
    archive = (await claimArchive(token)).archive
    // Post blocks to one archive
    for (let blockCount = 0; blockCount < blocksPosted; blockCount++) {
      const block = getNewBlockWithPayloadsOfSchemaType()
      const blockResponse = await postBlock(block, archive)
      expect(blockResponse.length).toBe(1)
    }

    // Post blocks to another archive
    token = await getTokenForNewUser()
    archive = (await claimArchive(token)).archive
    for (let blockCount = 0; blockCount < blocksPosted; blockCount++) {
      const block = getNewBlockWithPayloadsOfSchemaType()
      const blockResponse = await postBlock(block, archive)
      expect(blockResponse.length).toBe(1)
    }
  }, 25000)
  it('Returns stats on all payload schemas in archive', async () => {
    const response = await getArchivist().get(`/archive/${archive}/payload/schema/stats`).expect(StatusCodes.OK)
    const stats = response.body.data
    expect(stats).toBeTruthy()
    expect(stats.counts).toBeTruthy()
    expect(typeof stats.counts).toBe('object')
    const { counts } = stats
    const schemas = Object.keys(counts)
    expect(schemas).toBeTruthy()
    expect(schemas.length).toBe(blocksPosted)
    schemas.forEach((schema) => {
      expect(counts).toHaveProperty(schema)
      const count = counts[schema]
      expect(count).toBe(1)
    })
  })
})
