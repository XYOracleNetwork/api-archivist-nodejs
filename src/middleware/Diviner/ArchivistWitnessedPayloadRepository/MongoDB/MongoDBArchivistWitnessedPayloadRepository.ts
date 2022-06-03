import { XyoAccount, XyoBoundWitness, XyoPayload } from '@xyo-network/sdk-xyo-client-js'
import { BaseMongoSdk } from '@xyo-network/sdk-xyo-mongo-js'
import { Filter } from 'mongodb'

import { getBaseMongoSdk } from '../../../../lib'
import { AbstractPayloadRepository } from '../../../../model'

export class MongoDBArchivistWitnessedPayloadRepository extends AbstractPayloadRepository<XyoPayload, string, Filter<XyoPayload>> {
  constructor(
    protected account: XyoAccount,
    protected payloads: BaseMongoSdk<XyoPayload> = getBaseMongoSdk<XyoPayload>('payloads'),
    protected boundWitnesses: BaseMongoSdk<XyoBoundWitness> = getBaseMongoSdk<XyoBoundWitness>('bound_witnesses')
  ) {
    super()
  }
  find(_filter: Filter<XyoPayload>): Promise<XyoPayload[]> {
    throw new Error('Not implemented')
    // TODO: How to support filtering but add our own filter in aggregation
  }
  async get(hash: string): Promise<XyoPayload[]> {
    // TODO: Find bw signed by us that has this hash, then find payload
    return (await this.payloads.find({ _hash: hash })).toArray()
  }
  async insert(items: XyoPayload[]): Promise<XyoPayload[]> {
    // TODO: Witness from archivist
    // TODO: sanitize before storage, grab methods: prepareBoundWitnesses, validatePayloadSchema, storeBoundWitnesses, storePayloads from post.ts for reference
    const result = await this.payloads.insertMany(items)
    if (result.insertedCount != items.length) {
      throw new Error('Error inserting Payloads')
    }
    return items
  }
}
