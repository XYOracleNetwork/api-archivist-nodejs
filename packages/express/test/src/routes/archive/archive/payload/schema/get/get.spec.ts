import { XyoSchemaPayload } from '@xyo-network/schema-payload-plugin'
import { XyoAccount, XyoBoundWitnessBuilder } from '@xyo-network/sdk-xyo-client-js'
import { StatusCodes } from 'http-status-codes'

import { claimArchive, getSchemaName, getTokenForNewUser, postBlock, request, testSchemaPrefix } from '../../../../../../testUtil'

const blocksPosted = 2
const definition = { $schema: 'http://json-schema.org/draft-07/schema#' }

const getNewBlockWithPayloadsOfSchemaType = (schema = getSchemaName()) => {
  return new XyoBoundWitnessBuilder({ inlinePayloads: true })
    .payload({ definition, schema } as XyoSchemaPayload)
    .witness(XyoAccount.random())
    .build()
}

describe('/archive/:archive/payload/schema', () => {
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
  it('Returns payloads schemas used in archive', async () => {
    const response = await (await request()).get(`/archive/${archive}/payload/schema`).expect(StatusCodes.OK)
    const schemas = response.body.data as string[]
    expect(schemas).toBeTruthy()
    expect(Array.isArray(schemas)).toBeTruthy()
    expect(schemas.length).toBe(blocksPosted)
    schemas.forEach((schema) => {
      expect(schema.startsWith(testSchemaPrefix)).toBeTruthy()
    })
  })
})
