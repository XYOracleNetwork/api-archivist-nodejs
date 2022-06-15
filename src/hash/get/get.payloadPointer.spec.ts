import { assertEx } from '@xylabs/sdk-js'
import { XyoBoundWitness, XyoPayload, XyoPayloadBuilder } from '@xyo-network/sdk-xyo-client-js'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'

import { claimArchive, getArchiveName, getHash, getNewBlock, getNewBlockWithPayloads, getTokenForNewUser, postBlock, setArchiveAccessControl } from '../../test'
import { PayloadPointerBody, payloadPointerSchema } from './PayloadPointer'

const getPayloadPointer = (archive: string, schema: string, timestamp = Date.now()): XyoPayload => {
  const fields: PayloadPointerBody = { reference: { archive, schema, timestamp }, schema }
  return new XyoPayloadBuilder<PayloadPointerBody>({ schema: payloadPointerSchema }).fields(fields).build()
}

describe('/:hash', () => {
  let token: string
  let archive: string
  let block: XyoBoundWitness
  let payload: XyoPayload
  let pointerHash: string
  beforeAll(() => jest.spyOn(console, 'error').mockImplementation())
  beforeEach(async () => {
    token = await getTokenForNewUser()
    archive = getArchiveName()
    await claimArchive(token, archive)
    block = getNewBlockWithPayloads(1)
    payload = assertEx(block._payloads?.[0])
    const blockResponse = await postBlock(block, archive)
    expect(blockResponse.length).toBe(1)
    const pointer = getPayloadPointer(archive, payload.schema)
    const pointerResponse = await postBlock(getNewBlock(pointer), archive)
    expect(pointerResponse.length).toBe(1)
    pointerHash = pointerResponse[0].payload_hashes[0]
  })
  describe('return format is', () => {
    it('a single payload', async () => {
      const response = await getHash(pointerHash)
      expect(response).toBeTruthy()
      expect(Array.isArray(response)).toBe(false)
      expect(response.schema).toEqual(payload?.schema)
      // NOTE: This is brittle if we add any additional underscored fields
      // but we do want to check that each property we care about is equivalent
      expect(payload).toEqual({
        ...response,
        _client: 'js',
        _hash: expect.any(String),
        _timestamp: expect.any(Number),
      })
    })
  })
  describe('with public archive', () => {
    it('with anonymous user returns the payload', async () => {
      await getHash(pointerHash, undefined)
    })
    it('with non-archive owner returns the payload', async () => {
      const token = await getTokenForNewUser()
      await getHash(pointerHash, token)
    })
    it('with archive owner returns the payload', async () => {
      const result = await getHash(pointerHash, token)
      expect(result).toBeTruthy()
    })
  })
  describe('with private archive', () => {
    beforeEach(async () => {
      await setArchiveAccessControl(token, archive, { accessControl: true, archive })
      const blockResponse = await postBlock(block, archive, token)
      expect(blockResponse.length).toBe(1)
    })
    describe(`returns ${ReasonPhrases.NOT_FOUND}`, () => {
      it('with anonymous user', async () => {
        await getHash(pointerHash, undefined, StatusCodes.NOT_FOUND)
      })
      it('with non-archive owner', async () => {
        const otherToken = await getTokenForNewUser()
        await getHash(pointerHash, otherToken, StatusCodes.NOT_FOUND)
      })
    })
    it('with archive owner returns the payload', async () => {
      const result = await getHash(pointerHash, token)
      expect(result).toBeTruthy()
    })
  })
  describe('with nonexistent hash', () => {
    it(`returns ${ReasonPhrases.NOT_FOUND}`, async () => {
      await getHash('non_existent_hash', undefined, StatusCodes.NOT_FOUND)
    })
  })
})
