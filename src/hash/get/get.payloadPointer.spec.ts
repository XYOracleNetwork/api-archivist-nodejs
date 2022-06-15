import { XyoPayload } from '@xyo-network/sdk-xyo-client-js'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'

import {
  claimArchive,
  getArchiveName,
  getHash,
  getNewBlockWithBoundWitnessesWithPayloads,
  getNewBlockWithPayloads,
  getTokenForNewUser,
  postBlock,
  setArchiveAccessControl,
} from '../../test'

const getPayloadPointer = () => {
  throw new Error('')
}

describe('/:hash', () => {
  let token = ''
  let archive = ''
  const block = getNewBlockWithPayloads(1)
  expect(block).toBeTruthy()
  const boundWitnessHash = block?._hash as string
  expect(boundWitnessHash).toBeTruthy()
  const payload = block._payloads?.[0]
  expect(payload).toBeTruthy()
  const payloadHash = block.payload_hashes?.[0]
  expect(payloadHash).toBeTruthy()
  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {
      // Stop expected errors from being logged
    })
  })
  beforeEach(async () => {
    token = await getTokenForNewUser()
    archive = getArchiveName()
    await claimArchive(token, archive)
    const blockResponse = await postBlock(block, archive)
    expect(blockResponse.length).toBe(1)
  })
  describe('return format is', () => {
    it('a single payload', async () => {
      const response = await getHash(payloadHash)
      expect(response).toBeTruthy()
      expect(Array.isArray(response)).toBe(false)
      const actual = response as XyoPayload
      expect(actual.schema).toEqual(payload?.schema)
    })
  })
  describe('with public archive', () => {
    it('with anonymous user returns the payload', async () => {
      await getHash(payloadHash, undefined)
    })
    it('with non-archive owner returns the payload', async () => {
      const token = await getTokenForNewUser()
      await getHash(payloadHash, token)
    })
    it('with archive owner returns the payload', async () => {
      const result = await getHash(payloadHash, token)
      expect(result).toBeTruthy()
    })
  })
  describe('with private archive', () => {
    beforeAll(async () => {
      await setArchiveAccessControl(token, archive, { accessControl: true, archive })
      const blockResponse = await postBlock(block, archive, token)
      expect(blockResponse.length).toBe(1)
    })
    describe(`returns ${ReasonPhrases.NOT_FOUND}`, () => {
      it('with anonymous user', async () => {
        await getHash(payloadHash, undefined, StatusCodes.NOT_FOUND)
      })
      it('with non-archive owner', async () => {
        const token = await getTokenForNewUser()
        await getHash(payloadHash, token, StatusCodes.NOT_FOUND)
      })
    })
    it('with archive owner returns the payload', async () => {
      const result = await getHash(payloadHash, token)
      expect(result).toBeTruthy()
    })
  })
  describe('with nonexistent hash', () => {
    it(`returns ${ReasonPhrases.NOT_FOUND}`, async () => {
      await getHash('non_existent_hash', undefined, StatusCodes.NOT_FOUND)
    })
  })
})
