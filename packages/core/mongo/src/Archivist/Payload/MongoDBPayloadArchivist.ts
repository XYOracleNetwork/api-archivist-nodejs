import { AbstractPayloadArchivist, XyoPayloadFilterPredicate } from '@xyo-network/archivist-model'
import { XyoPayloadWithMeta } from '@xyo-network/sdk-xyo-client-js'
import { BaseMongoSdk } from '@xyo-network/sdk-xyo-mongo-js'
import { inject, injectable } from 'inversify'

import { removeId } from '../../Mongo'
import { MONGO_TYPES } from '../../types'

@injectable()
export class MongoDBPayloadArchivist extends AbstractPayloadArchivist<XyoPayloadWithMeta, string> {
  constructor(@inject(MONGO_TYPES.PayloadSdkMongo) protected sdk: BaseMongoSdk<XyoPayloadWithMeta>) {
    super()
  }
  async find(predicate: XyoPayloadFilterPredicate<XyoPayloadWithMeta>): Promise<XyoPayloadWithMeta[]> {
    const { limit, order, ...props } = predicate
    const sortOrder = order || 'desc'
    const parsedLimit = limit || 20
    const filter = {
      ...props,
    }
    return (await this.sdk.find(filter)).sort({ _timestamp: sortOrder }).limit(parsedLimit).toArray()
  }
  async get(hash: string): Promise<XyoPayloadWithMeta[]> {
    return (await this.sdk.find({ _hash: hash })).limit(1).toArray()
  }
  async insert(items: XyoPayloadWithMeta[]): Promise<XyoPayloadWithMeta[]> {
    const result = await this.sdk.insertMany(items.map(removeId) as XyoPayloadWithMeta[])
    if (result.insertedCount != items.length) {
      throw new Error('Error inserting Payloads')
    }
    return items
  }
}
