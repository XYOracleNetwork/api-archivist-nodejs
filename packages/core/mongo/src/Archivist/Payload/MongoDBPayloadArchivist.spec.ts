import { XyoAccount } from '@xyo-network/account'
import {
  XyoArchivistFindQuery,
  XyoArchivistFindQuerySchema,
  XyoArchivistGetQuery,
  XyoArchivistGetQuerySchema,
  XyoArchivistInsertQuery,
  XyoArchivistInsertQuerySchema,
} from '@xyo-network/archivist'
import { DebugPayload, DebugPayloadWithMeta, DebugSchema, XyoPayloadFilterPredicate } from '@xyo-network/archivist-model'
import { XyoBoundWitness } from '@xyo-network/boundwitness'
import { XyoPayloadBuilder, XyoPayloadWithMeta, XyoPayloadWrapper } from '@xyo-network/payload'
import { v4 } from 'uuid'

import { COLLECTIONS } from '../../collections'
import { getBaseMongoSdk } from '../../Mongo'
import { MongoDBPayloadArchivist } from './MongoDBPayloadArchivist'

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

describe('MongoDBPayloadArchivist', () => {
  const sdk = getBaseMongoSdk<XyoPayloadWithMeta>(COLLECTIONS.Payloads)
  const account = XyoAccount.random()
  const sut = new MongoDBPayloadArchivist(account, sdk)
  const archive = `test-${v4()}`
  const payloads: XyoPayloadWithMeta<DebugPayload>[] = getPayloads(archive, count)
  const hashes: string[] = payloads.map((p) => new XyoPayloadWrapper(p).hash)
  const payload = payloads[0]
  const hash = hashes[0]

  beforeAll(async () => {
    const query: XyoArchivistInsertQuery = {
      payloads,
      schema: XyoArchivistInsertQuerySchema,
    }
    const result = await sut.query(query)
    expect(result).toBeArrayOfSize(count)
    const bw: XyoBoundWitness = result?.[0]
    expect(bw).toBeObject()
    expect(bw._signatures).toBeArrayOfSize(1)
    expect(bw.addresses).toBeArrayOfSize(1)
    expect(bw.addresses).toContain(account.addressValue.hex)
    expect(bw.payload_hashes).toIncludeAllMembers(hashes)
    expect(result?.[1]).toBeArrayOfSize(1 + payloads.length)
    expect(result?.[1]).toIncludeAllMembers(payloads)
  })

  describe('XyoArchivistInsertQuery', () => {
    it('inserts multiple payloads', async () => {
      // NOTE: Done as part of beforeAll out of necessity
      // for subsequent tests. Not repeated again here for
      // performance.
    })
  })
  describe('XyoArchivistFindQuery', () => {
    it('finds payloads by schema', async () => {
      const limit = 1
      const filter: XyoPayloadFilterPredicate<XyoPayloadWithMeta> = { limit, schema }
      const query: XyoArchivistFindQuery = {
        filter,
        schema: XyoArchivistFindQuerySchema,
      }
      const result = await sut.query(query)
      expect(result).toBeArrayOfSize(2)
      const payload = result?.[1]?.[0]
      expect(payload).toBeObject()
      expect(payload?.schema).toEqual(schema)
    })
    it('finds payloads by hash', async () => {
      const limit = 1
      const filter: XyoPayloadFilterPredicate<XyoPayloadWithMeta> = { hash, limit }
      const query: XyoArchivistFindQuery = {
        filter,
        schema: XyoArchivistFindQuerySchema,
      }
      const result = await sut.query(query)
      expect(result).toBeArrayOfSize(2)
      const bw: XyoBoundWitness = result?.[0]
      expect(bw).toBeObject()
      expect(bw._signatures).toBeArrayOfSize(1)
      expect(bw.addresses).toBeArrayOfSize(1)
      expect(bw.addresses).toContain(account.addressValue.hex)
      expect(bw.payload_hashes).toInclude(hash)
      expect(result?.[1]).toBeArrayOfSize(limit)
      expect(result?.[1]).toEqual([payload])
    })
  })
  describe('XyoArchivistGetQuery', () => {
    it('gets payloads by hashes', async () => {
      const query: XyoArchivistGetQuery = {
        hashes,
        schema: XyoArchivistGetQuerySchema,
      }
      const result = await sut.query(query)
      expect(result).toBeArrayOfSize(2)
      const bw: XyoBoundWitness = result?.[0]
      expect(bw).toBeObject()
      expect(bw._signatures).toBeArrayOfSize(1)
      expect(bw.addresses).toBeArrayOfSize(1)
      expect(bw.addresses).toContain(account.addressValue.hex)
      expect(bw.payload_hashes).toInclude(hash)
      expect(result?.[1]).toBeArrayOfSize(hashes.length)
      expect(result?.[1]).toContainValues(payloads)
    })
  })
})
