import { XyoAccount } from '@xyo-network/account'
import { XyoArchivistFindQuery, XyoArchivistFindQuerySchema, XyoArchivistInsertQuery, XyoArchivistInsertQuerySchema } from '@xyo-network/archivist'
import { DebugPayload, DebugPayloadWithMeta, debugSchema, XyoPayloadFilterPredicate } from '@xyo-network/archivist-model'
import { XyoBoundWitness } from '@xyo-network/boundwitness'
import { XyoPayload, XyoPayloadBuilder, XyoPayloadWithMeta, XyoPayloadWrapper } from '@xyo-network/payload'
import { v4 } from 'uuid'

import { COLLECTIONS } from '../../collections'
import { getBaseMongoSdk } from '../../Mongo'
import { MongoDBPayloadArchivist } from './MongoDBPayloadArchivist'

const count = 2
const schema = debugSchema

const getPayloads = (archive: string, count = 1): XyoPayloadWithMeta<DebugPayload>[] => {
  const payloads: XyoPayloadWithMeta<DebugPayload>[] = []
  for (let i = 0; i < 2; i++) {
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
  const payloads: XyoPayloadWithMeta<DebugPayload>[] = getPayloads(archive, 2)
  const hashes: string[] = payloads.map((p) => new XyoPayloadWrapper(p).hash)
  const payload = payloads[0]
  const hash = hashes[0]

  beforeAll(async () => {
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

  describe('insert', () => {
    it('inserts multiple payloads', async () => {
      // NOTE: Done as part of beforeAll out of necessity
      // for subsequent tests. Not repeated again here for
      // performance.
    })
  })
  describe('find', () => {
    it('finds payloads by schema', async () => {
      const filter: XyoPayloadFilterPredicate<XyoPayloadWithMeta> = { limit: 1, schema }
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
      expect(result?.[1]).toBeArrayOfSize(1)
      expect(result?.[1]).toEqual([payload])
    })
    it('finds payloads by hash', async () => {
      const filter: XyoPayloadFilterPredicate<XyoPayloadWithMeta> = { hash, limit: 1 }
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
      expect(result?.[1]).toBeArrayOfSize(1)
      expect(result?.[1]).toEqual([payload])
    })
  })
  describe('get', () => {
    it('gets single payload', async () => {
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
