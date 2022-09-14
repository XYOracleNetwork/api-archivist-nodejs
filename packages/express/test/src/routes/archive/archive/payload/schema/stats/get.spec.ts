import { XyoAccount } from '@xyo-network/account'
import { XyoBoundWitnessBuilder } from '@xyo-network/boundwitness'
import { XyoSchemaPayload } from '@xyo-network/schema-payload-plugin'
import { StatusCodes } from 'http-status-codes'

import { claimArchive, getSchemaName, getTokenForNewUser, postBlock, request } from '../../../../../../testUtil'

const blocksPosted = 2
const definition = { $schema: 'http://json-schema.org/draft-07/schema#' }

const getNewBlockWithPayloadsOfSchemaType = (schema = getSchemaName()) => {
  return new XyoBoundWitnessBuilder({ inlinePayloads: true })
    .payload({ definition, schema } as XyoSchemaPayload)
    .witness(XyoAccount.random())
    .build()
}

describe('/archive/:archive/payload/schema/stats', () => {
  let token = ''
  let archive = ''
  let otherArchive = ''
  beforeAll(async () => {
    token = await getTokenForNewUser()
    archive = (await claimArchive(token)).archive
    otherArchive = (await claimArchive(token)).archive

    // NOTE: POST in parallel to speed up test
    const postedPayloads = [
      // POST Payloads to test archive
      new Array(blocksPosted).fill(null).map(async () => {
        const block = getNewBlockWithPayloadsOfSchemaType()
        const response = await postBlock(block, archive)
        expect(response.length).toBe(1)
      }),
      // Post some payloads to another archive
      new Array(blocksPosted).fill(null).map(async () => {
        const block = getNewBlockWithPayloadsOfSchemaType()
        const response = await postBlock(block, otherArchive)
        expect(response.length).toBe(1)
      }),
    ]
    await Promise.all(postedPayloads.flatMap((p) => p))
  })
  it('Returns stats on all payload schemas in archive', async () => {
    const response = await (await request()).get(`/archive/${archive}/payload/schema/stats`).expect(StatusCodes.OK)
    const stats = response.body.data
    expect(stats).toBeTruthy()
    expect(stats.counts).toBeTruthy()
    expect(typeof stats.counts).toBe('object')
    const { counts } = stats
    const schemas = Object.keys(counts)
    expect(schemas).toBeTruthy()
    expect(schemas.length).toBe(blocksPosted)
    schemas.forEach((schema) => {
      // expect(counts).toHaveProperty(schema, 1)
      expect(counts[schema]).toBe(1)
    })
  })
})
