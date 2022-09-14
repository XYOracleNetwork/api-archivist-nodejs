import { responseProfiler } from '@xylabs/sdk-api-express-ecs'
import { XyoAccount } from '@xyo-network/account'
import { DebugPayload, DebugPayloadWithMeta, debugSchema, XyoPayloadFilterPredicate } from '@xyo-network/archivist-model'
import { XyoPayloadBuilder, XyoPayloadWithMeta, XyoPayloadWrapper } from '@xyo-network/payload'
import exp from 'constants'
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
  })
  describe('find', () => {
    it('finds payloads', async () => {
      const hash = hashes?.[0]
      expect(hash).not.toBeEmpty()
      const payload = payloads?.[0]
      expect(payload).toBeObject()
      const predicate: XyoPayloadFilterPredicate<XyoPayloadWithMeta> = { archives: [archive], hash, limit: 1, schema }
      const result = await sut.find(predicate)
      expect(result).toBeArrayOfSize(1)
      expect(result?.[0]).toBeObject()
      expect(result?.[0]).toEqual(payload)
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
      expect(result).toEqual(payloads)
    })
  })
})
