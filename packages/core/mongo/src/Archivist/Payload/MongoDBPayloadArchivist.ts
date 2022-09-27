import { assertEx } from '@xylabs/assert'
import { XyoAccount } from '@xyo-network/account'
import { AbstractPayloadArchivist, ArchiveModuleConfig, XyoPayloadFilterPredicate, XyoPayloadWithMeta } from '@xyo-network/archivist-model'
import { TYPES } from '@xyo-network/archivist-types'
import { XyoBoundWitness } from '@xyo-network/boundwitness'
import { EmptyObject } from '@xyo-network/core'
import { BaseMongoSdk } from '@xyo-network/sdk-xyo-mongo-js'
import { inject, injectable } from 'inversify'
import { Filter, SortDirection } from 'mongodb'

import { removeId } from '../../Mongo'
import { MONGO_TYPES } from '../../types'

@injectable()
export class MongoDBPayloadArchivist extends AbstractPayloadArchivist<XyoPayloadWithMeta> {
  constructor(
    @inject(TYPES.Account) protected readonly account: XyoAccount,
    @inject(MONGO_TYPES.PayloadSdkMongo) protected sdk: BaseMongoSdk<XyoPayloadWithMeta>,
  ) {
    super(account, undefined)
  }
  async find(predicate: XyoPayloadFilterPredicate<XyoPayloadWithMeta>): Promise<XyoPayloadWithMeta[]> {
    const { _archive, archives, hash, limit, order, schema, schemas, timestamp, ...props } = predicate
    const parsedLimit = limit || 100
    const parsedOrder = order || 'desc'
    const sort: { [key: string]: SortDirection } = { _timestamp: parsedOrder === 'asc' ? 1 : -1 }
    const parsedTimestamp = timestamp ? timestamp : parsedOrder === 'desc' ? Date.now() : 0
    const _timestamp = parsedOrder === 'desc' ? { $lt: parsedTimestamp } : { $gt: parsedTimestamp }
    const filter: Filter<XyoPayloadWithMeta<EmptyObject>> = {
      ...props,
      _timestamp,
    }
    if (_archive) filter._archive = _archive
    if (archives?.length) filter._archive = { $in: archives }
    if (hash) filter._hash = hash
    if (schema) filter.schema = schema
    if (schemas?.length) filter.schema = { $in: schemas }
    return (await (await this.sdk.find(filter)).sort(sort).limit(parsedLimit).maxTimeMS(2000).toArray()).map(removeId)
  }
  async get(hashes: string[]): Promise<XyoPayloadWithMeta[]> {
    // NOTE: This assumes at most 1 of each hash is stored which is currently not the case
    const limit = hashes.length
    assertEx(limit > 0, 'MongoDBPayloadArchivist.get: No hashes supplied')
    assertEx(limit < 10, 'MongoDBPayloadArchivist.get: Retrieval of > 100 hashes at a time not supported')
    return (await (await this.sdk.find({ _hash: { $in: hashes } })).sort({ _timestamp: -1 }).limit(limit).toArray()).map(removeId)
  }
  async insert(items: XyoPayloadWithMeta[]): Promise<XyoBoundWitness> {
    const result = await this.sdk.insertMany(items.map(removeId) as XyoPayloadWithMeta[])
    if (result.insertedCount != items.length) {
      throw new Error('MongoDBPayloadArchivist.insert: Error inserting Payloads')
    }
    const [bw] = await this.bindPayloads(items)
    return bw
  }
}
