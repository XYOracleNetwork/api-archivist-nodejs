import { AbstractBoundWitnessArchivist, XyoBoundWitnessFilterPredicate } from '@xyo-network/archivist-model'
import { XyoBoundWitnessWithMeta } from '@xyo-network/sdk-xyo-client-js'
import { BaseMongoSdk } from '@xyo-network/sdk-xyo-mongo-js'
import { inject, injectable } from 'inversify'
import { Filter, SortDirection } from 'mongodb'

import { MONGO_TYPES } from '../../types'

@injectable()
export class MongoDBBoundWitnessArchivist extends AbstractBoundWitnessArchivist<string> {
  constructor(@inject(MONGO_TYPES.BoundWitnessSdkMongo) protected readonly sdk: BaseMongoSdk<XyoBoundWitnessWithMeta>) {
    super()
  }
  async find(predicate: XyoBoundWitnessFilterPredicate): Promise<XyoBoundWitnessWithMeta[]> {
    const { hash, limit, order, timestamp, ...props } = predicate
    const parsedLimit = limit || 100
    const parsedOrder = order || 'desc'
    const sort: { [key: string]: SortDirection } = { _timestamp: parsedOrder === 'asc' ? 1 : -1 }
    const parsedTimestamp = timestamp ? timestamp : parsedOrder === 'desc' ? Date.now() : 0
    const _timestamp = parsedOrder === 'desc' ? { $lt: parsedTimestamp } : { $gt: parsedTimestamp }
    const filter: Filter<XyoBoundWitnessWithMeta> = {
      ...props,
      _timestamp,
      schema: 'network.xyo.boundwitness',
    }
    if (hash) {
      filter._hash = hash
    }
    return (await this.sdk.find(filter)).sort(sort).limit(parsedLimit).maxTimeMS(2000).toArray()
  }
  async get(hash: string): Promise<XyoBoundWitnessWithMeta[]> {
    return (await this.sdk.find({ _hash: hash })).limit(100).toArray()
  }
  async insert(items: XyoBoundWitnessWithMeta[]): Promise<XyoBoundWitnessWithMeta[]> {
    // TODO: Remove _id if present
    const result = await this.sdk.insertMany(items)
    if (result.insertedCount != items.length) {
      throw new Error('Error inserting Payloads')
    }
    return items
  }
}
