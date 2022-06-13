import { XyoBoundWitness } from '@xyo-network/sdk-xyo-client-js'

import { getNewBlockWithBoundWitnessesWithPayloads } from '../../../../test'
import { prepareBoundWitnesses, PrepareBoundWitnessesResult } from './prepareBoundWitnesses'

const _archive = 'temp'
const _client = 'js'
const _observeDuration = 10
const _timestamp = 1655137984429
const _user_agent = 'Mozilla/5.0 (X11; CrOS x86_64 8172.45.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.64 Safari/537.36'

const boundWitnessMeta = {
  _archive,
  _client,
  _observeDuration,
  _timestamp,
  _user_agent,
}
const payloadMeta = {
  _archive,
  _client,
  _observeDuration,
  _timestamp,
  _user_agent,
}

const validateBeforeSanitization = (boundWitnesses: XyoBoundWitness[]) => {
  boundWitnesses.map((bw) => {
    expect(bw._archive).toBeUndefined()
    expect(bw._client).toBe(_client)
    expect(bw._hash).toBeDefined()
    expect(bw._observeDuration).toBeUndefined()
    expect(bw._payloads).toBeDefined()
    expect(Array.isArray(bw._payloads)).toBeTruthy()
    expect(bw._timestamp).toBeTruthy()
    expect(bw._user_agent).toBeUndefined()
    expect(bw.addresses).toBeDefined()
    expect(Array.isArray(bw.addresses)).toBeTruthy()
    expect(bw.payload_hashes).toBeDefined()
    expect(Array.isArray(bw.payload_hashes)).toBeTruthy()
    expect(bw.payload_schemas).toBeDefined()
    expect(Array.isArray(bw.payload_schemas)).toBeTruthy()
    expect(bw.schema).toBe('network.xyo.boundwitness')
    bw?._payloads?.map((p) => {
      expect(p._archive).toBeUndefined()
      expect(p._client).toBe(_client)
      expect(p._hash).toBeDefined()
      expect(p._observeDuration).toBeUndefined()
      expect(p._timestamp).toBeDefined()
      expect(p.schema).toBeDefined()
    })
  })
}

const validateAfterSanitization = (actual: PrepareBoundWitnessesResult) => {
  actual.sanitized.map((bw) => {
    expect(bw._archive).toBe(_archive)
    expect(bw._client).toBe(_client)
    expect(bw._hash).toBeTruthy()
    expect(bw._observeDuration).toBe(_observeDuration)
    expect(bw._payloads).toBeUndefined()
    expect(bw._timestamp).toBeTruthy()
    expect(bw._user_agent).toBeTruthy()
    expect(bw.addresses).toBeDefined()
    expect(Array.isArray(bw.addresses)).toBeTruthy()
    expect(bw.payload_hashes).toBeDefined()
    expect(Array.isArray(bw.payload_hashes)).toBeTruthy()
    expect(bw.payload_schemas).toBeDefined()
    expect(Array.isArray(bw.payload_schemas)).toBeTruthy()
    expect(bw.schema).toBe('network.xyo.boundwitness')
  })
  actual.payloads.map((p) => {
    expect(p._archive).toBe(_archive)
    expect(p._client).toBe(_client)
    expect(p._hash).toBeTruthy()
    expect(p._observeDuration).toBe(_observeDuration)
    expect(p._timestamp).toBeTruthy()
    expect(p.schema).toBeTruthy()
  })
}

describe('prepareBoundWitnesses', () => {
  describe.each([0, 1, 2])('with %d boundWitnesses', (numBoundWitnesses: number) => {
    it.each([0, 1, 2])('with %d payloads', (numPayloadVersions: number) => {
      const boundWitnesses = getNewBlockWithBoundWitnessesWithPayloads(numBoundWitnesses, numPayloadVersions)
      validateBeforeSanitization(boundWitnesses)
      const actual = prepareBoundWitnesses(boundWitnesses, boundWitnessMeta, payloadMeta)
      validateAfterSanitization(actual)
    })
  })
})
