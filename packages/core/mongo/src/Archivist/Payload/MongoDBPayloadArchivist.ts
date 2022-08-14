import { AbstractPayloadArchivist } from '@xyo-network/archivist-model'
import { XyoPayloadWithMeta } from '@xyo-network/sdk-xyo-client-js'
import { BaseMongoSdk } from '@xyo-network/sdk-xyo-mongo-js'
import { inject, injectable } from 'inversify'
import { Filter } from 'mongodb'

import { removeId } from '../../Mongo'
import { MONGO_TYPES } from '../../types'

@injectable()
export class MongoDBPayloadArchivist extends AbstractPayloadArchivist<XyoPayloadWithMeta, string, Filter<XyoPayloadWithMeta>> {
  constructor(@inject(MONGO_TYPES.PayloadSdkMongo) protected sdk: BaseMongoSdk<XyoPayloadWithMeta>) {
    super()
  }
  async find(filter: Filter<XyoPayloadWithMeta>): Promise<XyoPayloadWithMeta[]> {
    return (await this.sdk.find(filter)).limit(100).toArray()
  }
  async get(hash: string): Promise<XyoPayloadWithMeta[]> {
    return (await this.sdk.find({ _hash: hash })).limit(100).toArray()
  }
  async insert(items: XyoPayloadWithMeta[]): Promise<XyoPayloadWithMeta[]> {
    const result = await this.sdk.insertMany(items.map(removeId) as XyoPayloadWithMeta[])
    if (result.insertedCount != items.length) {
      throw new Error('Error inserting Payloads')
    }
    return items
  }
}
