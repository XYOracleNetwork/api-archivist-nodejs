import { XyoAccount } from '@xyo-network/account'
import {
  XyoArchivistFindQuery,
  XyoArchivistFindQuerySchema,
  XyoArchivistGetQuery,
  XyoArchivistGetQuerySchema,
  XyoArchivistInsertQuery,
  XyoArchivistInsertQuerySchema,
} from '@xyo-network/archivist'
import {
  DebugPayload,
  DebugPayloadWithMeta,
  DebugSchema,
  XyoBoundWitnessWithMeta,
  XyoPayloadFilterPredicate,
  XyoPayloadWithMeta,
  XyoPayloadWithPartialMeta,
} from '@xyo-network/archivist-model'
import { BoundWitnessBuilder, XyoBoundWitness } from '@xyo-network/boundwitness'
import { PayloadWrapper, XyoPayloadBuilder } from '@xyo-network/payload'
import { v4 } from 'uuid'

import { COLLECTIONS } from '../../collections'
import { getBaseMongoSdk } from '../../Mongo'
import { MongoDBBoundWitnessArchivist } from './MongoDBBoundWitnessArchivist'

const count = 2
const schema = DebugSchema

const getPayloads = (archive: string, count = 1): XyoPayloadWithMeta<DebugPayload>[] => {
  const payloads: XyoPayloadWithMeta<DebugPayload>[] = []
  for (let i = 0; i < count; i++) {
    const nonce = v4()
    const payload = new XyoPayloadBuilder<DebugPayloadWithMeta>({ schema }).fields({ nonce }).build()
    payload._archive = archive
    payloads.push(payload)
  }
  return payloads
}

const removePayloads = (boundWitnesses: XyoBoundWitnessWithMeta[]) => {
  return boundWitnesses.map((bw) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _payloads, _timestamp, ...props } = bw
    return { ...props, _timestamp: expect.toBeNumber() }
  })
}

describe('MongoDBBoundWitnessArchivist', () => {
  const sdk = getBaseMongoSdk<XyoBoundWitnessWithMeta>(COLLECTIONS.BoundWitnesses)
  const account = XyoAccount.random()
  const sut = new MongoDBBoundWitnessArchivist(account, sdk)
  const archive = `test-${v4()}`
  const payloads: XyoPayloadWithMeta<DebugPayload>[] = getPayloads(archive, count)
  const boundWitnesses = payloads
    .map((p) => new BoundWitnessBuilder({ inlinePayloads: true }).payload(p).build())
    .map((bw) => {
      return { ...bw, _archive: archive } as XyoBoundWitnessWithMeta & XyoPayloadWithPartialMeta
    })
  const hashes: string[] = boundWitnesses.map((bw) => new PayloadWrapper(bw).hash)
  const boundWitness = boundWitnesses[0]
  const hash = hashes[0]

  beforeAll(async () => {
    const query: XyoArchivistInsertQuery = {
      payloads: boundWitnesses as any,
      schema: XyoArchivistInsertQuerySchema,
    }
    const queryWitness = new BoundWitnessBuilder().payload(query).build()
    const result = await sut.query(queryWitness, query, boundWitnesses)
    expect(result).toBeArrayOfSize(count)
    const bw: XyoBoundWitness = result?.[0]
    expect(bw).toBeObject()
    expect(bw._signatures).toBeArray()
    expect(bw._signatures.length).toBeGreaterThanOrEqual(1)
    expect(bw.addresses).toBeArray()
    expect(bw.addresses.length).toBeGreaterThanOrEqual(1)
    expect(bw.addresses).toContain(account.addressValue.hex)
    expect(result?.[1]).toBeArrayOfSize(1)
    expect((result?.[1]?.[0] as XyoBoundWitness).payload_hashes).toIncludeAllMembers(hashes)
  })

  describe('XyoArchivistInsertQuery', () => {
    it('inserts multiple boundWitnesses', async () => {
      // NOTE: Done as part of beforeAll out of necessity
      // for subsequent tests. Not repeated again here for
      // performance.
    })
  })
  describe('XyoArchivistFindQuery', () => {
    it('finds boundWitnesses by hash', async () => {
      const limit = 1
      const filter: XyoPayloadFilterPredicate<XyoPayloadWithMeta> = { hash, limit }
      const query: XyoArchivistFindQuery = {
        filter,
        schema: XyoArchivistFindQuerySchema,
      }
      const queryWitness = new BoundWitnessBuilder().payload(query).build()
      const result = await sut.query(queryWitness, query)
      expect(result).toBeArrayOfSize(2)
      const bw: XyoBoundWitness = result?.[0]
      expect(bw).toBeObject()
      expect(bw._signatures).toBeArray()
      expect(bw._signatures.length).toBeGreaterThanOrEqual(1)
      expect(bw.addresses).toBeArray()
      expect(bw.addresses.length).toBeGreaterThanOrEqual(1)
      expect(bw.addresses).toContain(account.addressValue.hex)
      expect(bw.payload_hashes).toInclude(hash)
      expect(result?.[1]).toBeArrayOfSize(limit)
      expect(result?.[1]).toEqual(removePayloads([boundWitness]))
    })
  })
  describe('XyoArchivistGetQuery', () => {
    it('gets boundWitnesses by hashes', async () => {
      const query: XyoArchivistGetQuery = {
        hashes,
        schema: XyoArchivistGetQuerySchema,
      }
      const queryWitness = new BoundWitnessBuilder().payload(query).build()
      const result = await sut.query(queryWitness, query)
      expect(result).toBeArrayOfSize(2)
      const bw: XyoBoundWitness = result?.[0]
      expect(bw).toBeObject()
      expect(bw._signatures).toBeArray()
      expect(bw._signatures.length).toBeGreaterThanOrEqual(1)
      expect(bw.addresses).toBeArray()
      expect(bw.addresses.length).toBeGreaterThanOrEqual(1)
      expect(bw.addresses).toContain(account.addressValue.hex)
      expect(bw.payload_hashes).toInclude(hash)
      expect(result?.[1]).toBeArrayOfSize(hashes.length)
      expect(result?.[1]).toContainValues(removePayloads([boundWitness]))
    })
  })
})
