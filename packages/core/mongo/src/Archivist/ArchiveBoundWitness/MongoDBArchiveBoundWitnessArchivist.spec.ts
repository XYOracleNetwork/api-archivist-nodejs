import { XyoAccount } from '@xyo-network/account'
import { XyoArchivistWrapper } from '@xyo-network/archivist'
import {
  DebugPayload,
  DebugPayloadWithMeta,
  DebugSchema,
  XyoBoundWitnessWithMeta,
  XyoBoundWitnessWithPartialMeta,
  XyoPayloadFilterPredicate,
  XyoPayloadWithMeta,
} from '@xyo-network/archivist-model'
import { BoundWitnessBuilder, BoundWitnessWrapper } from '@xyo-network/boundwitness'
import { XyoModuleConfigSchema } from '@xyo-network/module'
import { XyoPayloadBuilder } from '@xyo-network/payload'
import { v4 } from 'uuid'

import { COLLECTIONS } from '../../collections'
import { getBaseMongoSdk } from '../../Mongo'
import { MongoDBArchiveBoundWitnessArchivist } from './MongoDBArchiveBoundWitnessArchivist'

const count = 2
const schema = DebugSchema
const limit = 1

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

const removePayloads = (boundWitnesses: XyoBoundWitnessWithPartialMeta[]) => {
  return boundWitnesses.map((bw) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _archive, _payloads, _timestamp, timestamp, ...props } = bw
    return { ...props, _archive: expect.toBeString(), _timestamp: expect.toBeNumber() }
  })
}

describe('MongoDBArchiveBoundWitnessArchivist', () => {
  const sdk = getBaseMongoSdk<XyoBoundWitnessWithMeta>(COLLECTIONS.BoundWitnesses)
  const account = XyoAccount.random()
  const archive = `test-${v4()}`
  const config = { archive, schema: XyoModuleConfigSchema }
  const sut = new MongoDBArchiveBoundWitnessArchivist(account, sdk, config)
  const payloads: XyoPayloadWithMeta<DebugPayload>[] = getPayloads(archive, count)
  const boundWitnesses = payloads.map((p) => new BoundWitnessBuilder({ inlinePayloads: true, timestamp: false }).payload(p).build()[0])
  const hashes: string[] = boundWitnesses.map((bw) => new BoundWitnessWrapper(bw).hash)
  const boundWitness = boundWitnesses[0]
  const hash = hashes[0]

  beforeAll(async () => {
    const wrapper = new XyoArchivistWrapper(sut)
    const result = await wrapper.insert(boundWitnesses)
    expect(result).toBeArrayOfSize(count)
    expect(result?.[0].addresses).toContain(account.addressValue.hex)
    expect(result?.[1].payload_hashes).toIncludeAllMembers(hashes)
  })

  describe('insert', () => {
    it('inserts multiple boundWitnesses', async () => {
      // NOTE: Done as part of beforeAll out of necessity
      // for subsequent tests. Not repeated again here for
      // performance.
    })
  })
  describe('find', () => {
    it('finds boundWitnesses by hash', async () => {
      const filter: XyoPayloadFilterPredicate<XyoPayloadWithMeta> = { hash, limit }
      const wrapper = new XyoArchivistWrapper(sut)
      const result = await wrapper.find(filter)
      expect(result).toBeArrayOfSize(limit)
      expect(result).toEqual(removePayloads([boundWitness]))
    })
  })
  describe('get', () => {
    it('gets boundWitnesses by hashes', async () => {
      const wrapper = new XyoArchivistWrapper(sut)
      const result = await wrapper.get(hashes)
      expect(result).toBeArrayOfSize(count)
      expect(result).toContainValues(removePayloads([boundWitness]))
    })
  })
})
