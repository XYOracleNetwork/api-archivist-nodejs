import { assertEx } from '@xylabs/assert'
import { XyoAccount } from '@xyo-network/account'
import { prepareBoundWitnesses } from '@xyo-network/archivist-lib'
import {
  AbstractBoundWitnessArchivist,
  ArchiveBoundWitnessesArchivistId,
  BoundWitnessArchivist,
  XyoArchiveBoundWitnessFilterPredicate,
  XyoBoundWitnessMeta,
  XyoBoundWitnessWithMeta,
  XyoPayloadMeta,
  XyoPayloadWithPartialMeta,
} from '@xyo-network/archivist-model'
import { TYPES } from '@xyo-network/archivist-types'
import { EmptyObject } from '@xyo-network/core'
import { PayloadWrapper } from '@xyo-network/payload'
import { BaseMongoSdk } from '@xyo-network/sdk-xyo-mongo-js'
import { inject, injectable } from 'inversify'
import { Filter, SortDirection } from 'mongodb'

import { removeId } from '../../Mongo'
import { MONGO_TYPES } from '../../types'

@injectable()
export class MongoDBArchiveBoundWitnessesArchivist
  extends AbstractBoundWitnessArchivist<ArchiveBoundWitnessesArchivistId>
  implements BoundWitnessArchivist<ArchiveBoundWitnessesArchivistId>
{
  constructor(
    @inject(TYPES.Account) protected readonly account: XyoAccount,
    @inject(MONGO_TYPES.BoundWitnessSdkMongo) protected readonly sdk: BaseMongoSdk<XyoBoundWitnessWithMeta>,
  ) {
    super(account)
  }

  async find(
    predicate: XyoArchiveBoundWitnessFilterPredicate,
  ): Promise<XyoBoundWitnessWithMeta<EmptyObject, XyoPayloadWithPartialMeta<EmptyObject>>[]> {
    const { archive, addresses, hash, limit, order, payload_hashes, payload_schemas, timestamp, ...props } = predicate
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
    if (archive) filter._archive = archive
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
  async get(ids: ArchiveBoundWitnessesArchivistId[]): Promise<Array<XyoBoundWitnessWithMeta | null>> {
    const predicates = ids.map((id) => {
      const _archive = assertEx(id.archive, 'MongoDBArchiveBoundWitnessesArchivist.get: Missing archive')
      const _hash = assertEx(id.hash, 'MongoDBArchiveBoundWitnessesArchivist.get: Missing hash')
      return { _archive, _hash }
    })
    const queries = predicates.map(async (predicate) => {
      const result = (await (await this.sdk.find(predicate)).limit(1).toArray()).map(removeId)
      return result?.[0] || null
    })
    const results = await Promise.all(queries)
    return results
  }

  async insert(items: XyoBoundWitnessWithMeta[]): Promise<XyoBoundWitnessWithMeta> {
    const _timestamp = Date.now()
    const bws = items
      .map((bw) => {
        const _archive = assertEx(bw._archive, 'MongoDBArchiveBoundWitnessesArchivist.insert: Missing archive')
        const bwMeta: XyoBoundWitnessMeta = { _archive, _hash: new PayloadWrapper(bw).hash, _timestamp }
        const payloadMeta: XyoPayloadMeta = { _archive, _hash: '', _timestamp }
        return prepareBoundWitnesses([bw], bwMeta, payloadMeta)
      })
      .map((r) => r.sanitized[0])
    // TODO: Should we insert payloads here too?
    const result = await this.sdk.insertMany(bws.map(removeId))
    if (result.insertedCount != items.length) {
      throw new Error('MongoDBArchiveBoundWitnessesArchivist.insert: Error inserting BoundWitnesses')
    }
    return this.bindPayloads(bws)
  }
}
