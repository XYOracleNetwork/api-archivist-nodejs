import { XyoPayload } from '@xyo-network/sdk-xyo-client-js'
import { BaseMongoSdk } from '@xyo-network/sdk-xyo-mongo-js'
import { Filter } from 'mongodb'

import { getBaseMongoSdk } from '../../../lib'
import { AbstractPayloadRepository } from '../../../model'

export class MongoDBPayloadRepository extends AbstractPayloadRepository<XyoPayload, string, XyoPayload[], Filter<XyoPayload>> {
  constructor(protected sdk: BaseMongoSdk<XyoPayload> = getBaseMongoSdk<XyoPayload>('payloads')) {
    super()
  }
  async find(filter: Filter<XyoPayload>): Promise<XyoPayload[]> {
    return (await this.sdk.find(filter)).toArray()
  }
  async get(hash: string): Promise<XyoPayload[]> {
    return (await this.sdk.find({ _hash: hash })).toArray()
  }
  async insert(items: XyoPayload[]): Promise<XyoPayload[]> {
    const result = await this.sdk.insertMany(items)
    if (result.insertedCount != items.length) {
      throw new Error('Error inserting Payloads')
    }
    return items
  }
}
