import { XyoAccount } from '@xyo-network/account'
import { XyoArchivistInsertQuery, XyoArchivistInsertQuerySchema } from '@xyo-network/archivist'
import { DebugPayload, DebugPayloadWithMeta, debugSchema, XyoPayloadFilterPredicate } from '@xyo-network/archivist-model'
import { XyoBoundWitness } from '@xyo-network/boundwitness'
import { XyoPayloadBuilder, XyoPayloadWithMeta, XyoPayloadWrapper } from '@xyo-network/payload'
import { v4 } from 'uuid'

import { COLLECTIONS } from '../../collections'
import { getBaseMongoSdk } from '../../Mongo'
import { MongoDBPayloadArchivist } from './MongoDBPayloadArchivist'

const count = 2

describe('MongoDBPayloadArchivist', () => {
  const sdk = getBaseMongoSdk<XyoPayloadWithMeta>(COLLECTIONS.Payloads)
  const account = XyoAccount.random()
  const sut = new MongoDBPayloadArchivist(account, sdk)
  const archive = 'temp'
  const schema = debugSchema
  const payloads: XyoPayloadWithMeta<DebugPayload>[] = []
  const hashes: string[] = []

  beforeAll(async () => {
    for (let i = 0; i < 2; i++) {
      const nonce = v4()
      const payload = new XyoPayloadBuilder<DebugPayloadWithMeta>({ schema }).fields({ nonce }).build()
      payload._archive = archive
      const hash = new XyoPayloadWrapper(payload).hash
      payloads.push(payload)
      hashes.push(hash)
    }
    const result = await sut.insert(payloads)
    expect(result).toBeObject()
    expect(result.payload_hashes).toBeArrayOfSize(count)
    expect(result.payload_hashes).toEqual(hashes)
  })

  describe('insert', () => {
    it('inserts multiple payloads', async () => {
      // NOTE: Done as part of beforeAll out of necessity
      // for subsequent tests. Not repeated again here for
      // performance.
    })
    it('inserts via query', async () => {
      const query: XyoArchivistInsertQuery = {
        payloads,
        schema: XyoArchivistInsertQuerySchema,
      }
      const result = await sut.query(query)
      expect(result).toBeArrayOfSize(2)
      const bw: XyoBoundWitness = result?.[0]
      expect(bw).toBeObject()
      expect(bw._signatures).toBeArrayOfSize(1)
      expect(bw.addresses).toBeArrayOfSize(1)
      expect(bw.addresses).toContain(account.addressValue.hex)
      expect(bw.payload_hashes).toIncludeAllMembers(hashes)
      expect(result?.[1]).toBeArrayOfSize(1 + payloads.length)
      expect(result?.[1]).toIncludeAllMembers(payloads)
    })
  })
  describe('find', () => {
    it('finds payloads by hash', async () => {
      const hash = hashes?.[0]
      expect(hash).not.toBeEmpty()
      const payload = payloads?.[0]
      expect(payload).toBeObject()
      const predicate: XyoPayloadFilterPredicate<XyoPayloadWithMeta> = { hash, limit: 1 }
      const result = await sut.find(predicate)
      expect(result).toBeArrayOfSize(1)
      expect(result?.[0]).toBeObject()
      expect(result?.[0]).toEqual(payload)
    })
    it('finds payloads by schema', async () => {
      const hash = hashes?.[0]
      expect(hash).not.toBeEmpty()
      const payload = payloads?.[0]
      expect(payload).toBeObject()
      const predicate: XyoPayloadFilterPredicate<XyoPayloadWithMeta> = { limit: 1, schema }
      const result = await sut.find(predicate)
      expect(result).toBeArrayOfSize(1)
      expect(result?.[0]).toBeObject()
      expect(result?.[0].schema).toEqual(schema)
    })
  })
  describe('get', () => {
    it('gets single payload', async () => {
      const hash = hashes?.[0]
      expect(hash).not.toBeEmpty()
      const payload = payloads?.[0]
      expect(payload).toBeObject()
      const result = await sut.get([hash])
      expect(result).toBeArrayOfSize(1)
      expect(result?.[0]).toBeObject()
      expect(result?.[0]).toEqual(payload)
    })
    it('gets multiple payloads', async () => {
      const result = await sut.get(hashes)
      expect(result).toBeArrayOfSize(count)
      expect(result).toContainValues(payloads)
    })
  })
})
