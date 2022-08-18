import { assertEx } from '@xylabs/sdk-js'
import { ArchiveBoundWitnessesArchivist, ArchiveBoundWitnessesArchivistId, XyoArchiveBoundWitnessFilterPredicate } from '@xyo-network/archivist-model'
import { EmptyObject, XyoBoundWitnessWithMeta, XyoPayloadWithPartialMeta } from '@xyo-network/sdk-xyo-client-js'
import { BaseMongoSdk } from '@xyo-network/sdk-xyo-mongo-js'
import { inject, injectable } from 'inversify'
import { Filter, SortDirection } from 'mongodb'

import { removeId } from '../../Mongo'
import { MONGO_TYPES } from '../../types'

@injectable()
export class MongoDBArchiveBoundWitnessesArchivist implements ArchiveBoundWitnessesArchivist {
  constructor(@inject(MONGO_TYPES.BoundWitnessSdkMongo) protected readonly sdk: BaseMongoSdk<XyoBoundWitnessWithMeta>) {}
  async find(
    predicate: XyoArchiveBoundWitnessFilterPredicate,
  ): Promise<XyoBoundWitnessWithMeta<EmptyObject, XyoPayloadWithPartialMeta<EmptyObject>>[]> {
    const { archive, hash, limit, order, schema, timestamp, ...props } = predicate
    const parsedLimit = limit || 100
    const parsedOrder = order || 'desc'
    const sort: { [key: string]: SortDirection } = { _timestamp: parsedOrder === 'asc' ? 1 : -1 }
    const parsedTimestamp = timestamp ? timestamp : parsedOrder === 'desc' ? Date.now() : 0
    const _timestamp = parsedOrder === 'desc' ? { $lt: parsedTimestamp } : { $gt: parsedTimestamp }
    const filter: Filter<XyoBoundWitnessWithMeta> = {
      ...props,
      _archive: archive,
      _timestamp,
    }
    if (schema) {
      filter.schema = schema
    }
    if (hash) {
      filter._hash = hash
    }
    return (await this.sdk.find(filter)).sort(sort).limit(parsedLimit).maxTimeMS(2000).toArray()
  }
  async get(id: ArchiveBoundWitnessesArchivistId): Promise<XyoBoundWitnessWithMeta<EmptyObject, XyoPayloadWithPartialMeta<EmptyObject>>[]> {
    const predicate = { _archive: assertEx(id.archive), _hash: assertEx(id.hash) }
    return (await this.sdk.find(predicate)).limit(1).toArray()
  }
  async insert(items: XyoBoundWitnessWithMeta[]): Promise<XyoBoundWitnessWithMeta[]> {
    // TODO: Remove payloads, calculate hash, remove id, etc.
    const result = await this.sdk.insertMany(items.map(removeId) as XyoBoundWitnessWithMeta[])
    if (result.insertedCount != items.length) {
      throw new Error('Error inserting BoundWitnesses')
    }
    return items
  }
}
