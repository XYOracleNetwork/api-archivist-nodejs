import { assertEx } from '@xylabs/assert'
import { XyoAccount } from '@xyo-network/account'
import { prepareBoundWitnesses } from '@xyo-network/archivist-lib'
import {
  AbstractBoundWitnessArchivist,
  XyoBoundWitnessFilterPredicate,
  XyoBoundWitnessMeta,
  XyoBoundWitnessWithMeta,
} from '@xyo-network/archivist-model'
import { TYPES } from '@xyo-network/archivist-types'
import { XyoPayloadMeta, XyoPayloadWrapper } from '@xyo-network/payload'
import { BaseMongoSdk } from '@xyo-network/sdk-xyo-mongo-js'
import { inject, injectable } from 'inversify'
import { Filter, SortDirection } from 'mongodb'

import { removeId } from '../../Mongo'
import { MONGO_TYPES } from '../../types'

@injectable()
export class MongoDBBoundWitnessArchivist extends AbstractBoundWitnessArchivist {
  constructor(
    @inject(TYPES.Account) protected readonly account: XyoAccount,
    @inject(MONGO_TYPES.BoundWitnessSdkMongo) protected readonly sdk: BaseMongoSdk<XyoBoundWitnessWithMeta>,
  ) {
    super(account)
  }
  async find(predicate: XyoBoundWitnessFilterPredicate): Promise<XyoBoundWitnessWithMeta[]> {
    const { archives, addresses, hash, limit, order, payload_hashes, payload_schemas, timestamp, ...props } = predicate
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
    if (archives?.length) filter._archive = { $in: archives }
    if (hash) filter._hash = hash
    // NOTE: Defaulting to $all since it makes the most sense when singing addresses are supplied
    // but based on how MongoDB implements multi-key indexes $in might be much faster and we could
    // solve the multi-sig problem via multiple API calls when multi-sig is desired instead of
    // potentially impacting performance for all single-address queries
    if (addresses?.length) filter.addresses = { $all: addresses }
    if (payload_hashes?.length) filter.payload_hashes = { $in: payload_hashes }
    if (payload_schemas?.length) filter.payload_schemas = { $in: payload_schemas }
    return (await (await this.sdk.find(filter)).sort(sort).limit(parsedLimit).maxTimeMS(2000).toArray()).map(removeId)
  }
  async get(hashes: string[]): Promise<XyoBoundWitnessWithMeta[]> {
    // NOTE: This assumes at most 1 of each hash is stored which is currently not the case
    const limit = hashes.length
    assertEx(limit > 0, 'MongoDBBoundWitnessArchivist.get: No hashes supplied')
    assertEx(limit < 10, 'MongoDBBoundWitnessArchivist.get: Retrieval of > 100 hashes at a time not supported')
    return (await (await this.sdk.find({ _hash: { $in: hashes } })).limit(hashes.length).toArray()).map(removeId)
  }
  async insert(items: XyoBoundWitnessWithMeta[]): Promise<XyoBoundWitnessWithMeta> {
    const _timestamp = Date.now()
    const bws = items
      .map((bw) => {
        const _archive = assertEx(bw._archive, 'MongoDBBoundWitnessArchivist.insert: Missing archive')
        const bwMeta: XyoBoundWitnessMeta = { _archive, _hash: new XyoPayloadWrapper(bw).hash, _timestamp }
        const payloadMeta: XyoPayloadMeta = { _archive, _hash: '', _timestamp }
        return prepareBoundWitnesses([bw], bwMeta, payloadMeta)
      })
      .map((r) => r.sanitized[0])
    // TODO: Should we insert payloads here too?
    const result = await this.sdk.insertMany(bws.map(removeId))
    if (result.insertedCount != items.length) {
      throw new Error('MongoDBBoundWitnessArchivist.insert: Error inserting BoundWitnesses')
    }
    return this.bindPayloads(bws)
  }
}
