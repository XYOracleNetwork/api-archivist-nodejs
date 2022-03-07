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

describe('/:hash', () => {
  describe('return format is', () => {
    let token = ''
    let archive = ''
    const boundWitness = getNewBlockWithBoundWitnessesWithPayloads(2, 2)
    expect(boundWitness).toBeTruthy()
    const boundWitnessHash = boundWitness[0]?._hash as string
    expect(boundWitnessHash).toBeTruthy()
    const payload = boundWitness[0]._payloads?.[0]
    expect(payload).toBeTruthy()
    const payloadHash = boundWitness[0].payload_hashes?.[0]
    expect(payloadHash).toBeTruthy()
    beforeAll(async () => {
      token = await getTokenForNewUser()
      archive = getArchiveName()
      await claimArchive(token, archive)
      const blockResponse = await postBlock(boundWitness, archive)
      expect(blockResponse.boundWitnesses).toBe(2)
    })
    it('a single bound witness', async () => {
      const response = await getHash(boundWitnessHash)
      expect(response).toBeTruthy()
      expect(Array.isArray(response)).toBe(false)
    })
    it('a single payload', async () => {
      const response = await getHash(payloadHash)
      expect(response).toBeTruthy()
      expect(Array.isArray(response)).toBe(false)
    })
  })
  describe('with public archive', () => {
    let token = ''
    let archive = ''
    const boundWitness = getNewBlockWithPayloads(1)
    expect(boundWitness).toBeTruthy()
    const boundWitnessHash = boundWitness?._hash as string
    expect(boundWitnessHash).toBeTruthy()
    const payload = boundWitness._payloads?.[0]
    expect(payload).toBeTruthy()
    const payloadHash = boundWitness.payload_hashes?.[0]
    expect(payloadHash).toBeTruthy()
    beforeAll(async () => {
      token = await getTokenForNewUser()
      archive = getArchiveName()
      await claimArchive(token, archive)
      const blockResponse = await postBlock(boundWitness, archive)
      expect(blockResponse.boundWitnesses).toBe(1)
    })
    describe.each([
      ['bound witness', boundWitnessHash],
      ['payload', payloadHash],
    ])('with %s hash', (hashKind, hash) => {
      it(`with anonymous user returns the ${hashKind}`, async () => {
        await getHash(hash, undefined)
      })
      it(`with non-archive owner returns the ${hashKind}`, async () => {
        const token = await getTokenForNewUser()
        await getHash(hash, token)
      })
      it(`with archive owner returns the ${hashKind}`, async () => {
        const result = await getHash(hash, token)
        expect(result).toBeTruthy()
      })
    })
  })
  describe('with private archive', () => {
    let token = ''
    let archive = ''
    const boundWitness = getNewBlockWithPayloads(1)
    expect(boundWitness).toBeTruthy()
    const boundWitnessHash = boundWitness?._hash as string
    expect(boundWitnessHash).toBeTruthy()
    const payload = boundWitness._payloads?.[0]
    expect(payload).toBeTruthy()
    const payloadHash = boundWitness.payload_hashes?.[0]
    expect(payloadHash).toBeTruthy()
    beforeAll(async () => {
      token = await getTokenForNewUser()
      archive = getArchiveName()
      await claimArchive(token, archive)
      await setArchiveAccessControl(token, archive, { accessControl: true })
      const blockResponse = await postBlock(boundWitness, archive)
      expect(blockResponse.boundWitnesses).toBe(1)
    })
    describe.each([
      ['bound witness', boundWitnessHash],
      ['payload', payloadHash],
    ])('with %s hash', (hashKind, hash) => {
      it(`with anonymous user returns ${ReasonPhrases.NOT_FOUND}`, async () => {
        await getHash(hash, undefined, StatusCodes.NOT_FOUND)
      })
      it(`with non-archive owner returns ${ReasonPhrases.NOT_FOUND}`, async () => {
        const token = await getTokenForNewUser()
        await getHash(hash, token, StatusCodes.NOT_FOUND)
      })
      it(`with archive owner returns the ${hashKind}`, async () => {
        const result = await getHash(hash, token)
        expect(result).toBeTruthy()
      })
    })
  })
  describe('with nonexistent hash', () => {
    it(`returns ${ReasonPhrases.NOT_FOUND}`, async () => {
      await getHash('non_existent_hash', undefined, StatusCodes.NOT_FOUND)
    })
  })
})
