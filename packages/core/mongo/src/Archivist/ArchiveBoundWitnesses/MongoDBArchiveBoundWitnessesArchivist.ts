import { assertEx } from '@xylabs/assert'
import { ArchiveBoundWitnessesArchivist, ArchiveBoundWitnessesArchivistId, XyoArchiveBoundWitnessFilterPredicate } from '@xyo-network/archivist-model'
import { XyoBoundWitnessWithMeta } from '@xyo-network/boundwitness'
import { EmptyObject } from '@xyo-network/core'
import { XyoPayloadWithPartialMeta } from '@xyo-network/payload'
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
    const { addresses, archive, hash, limit, order, payload_hashes, payload_schemas, timestamp, ...props } = predicate
    const parsedLimit = limit || 100
    const parsedOrder = order || 'desc'
    const sort: { [key: string]: SortDirection } = { _timestamp: parsedOrder === 'asc' ? 1 : -1 }
    const parsedTimestamp = timestamp ? timestamp : parsedOrder === 'desc' ? Date.now() : 0
    const _timestamp = parsedOrder === 'desc' ? { $lt: parsedTimestamp } : { $gt: parsedTimestamp }
    const filter: Filter<XyoBoundWitnessWithMeta> = {
      ...props,
      _archive: archive,
      _timestamp,
      schema: 'network.xyo.boundwitness',
    }
    if (hash) filter._hash = hash
    // NOTE: Defaulting to $all since it makes the most sense when singing addresses are supplied
    // but based on how MongoDB implements multi-key indexes $in might be much faster and we could
    // solve the multi-sig problem via multiple API calls when multi-sig is desired instead of
    // potentially impacting performance for all single-address queries
    if (addresses?.length) filter.addresses = { $all: addresses }
    if (payload_hashes?.length) filter.payload_hashes = { $in: payload_hashes }
    if (payload_schemas?.length) filter.payload_schemas = { $in: payload_schemas }
    return (await this.sdk.find(filter)).sort(sort).limit(parsedLimit).maxTimeMS(2000).toArray()
  }
  async get(ids: ArchiveBoundWitnessesArchivistId[]): Promise<XyoBoundWitnessWithMeta<EmptyObject, XyoPayloadWithPartialMeta<EmptyObject>>[]> {
    assertEx(ids.length === 1, 'Retrieval of multiple Payloads not supported')
    const id = assertEx(ids.pop(), 'Missing id')
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
