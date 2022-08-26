import { assertEx } from '@xylabs/sdk-js'
import { ArchivePayloadsArchivist, ArchivePayloadsArchivistId, XyoArchivePayloadFilterPredicate } from '@xyo-network/archivist-model'
import { EmptyObject, XyoPayloadWithMeta } from '@xyo-network/sdk-xyo-client-js'
import { BaseMongoSdk } from '@xyo-network/sdk-xyo-mongo-js'
import { inject, injectable } from 'inversify'
import { Filter, SortDirection } from 'mongodb'

import { removeId } from '../../Mongo'
import { MONGO_TYPES } from '../../types'

@injectable()
class MongoDBArchivePayloadsArchivist implements ArchivePayloadsArchivist {
  constructor(@inject(MONGO_TYPES.PayloadSdkMongo) protected sdk: BaseMongoSdk<XyoPayloadWithMeta>) {}
  async find(predicate: XyoArchivePayloadFilterPredicate): Promise<XyoPayloadWithMeta[]> {
    const { archive, hash, limit, order, schema, schemas, timestamp, ...props } = predicate
    const parsedLimit = limit || 100
    const parsedOrder = order || 'desc'
    const sort: { [key: string]: SortDirection } = { _timestamp: parsedOrder === 'asc' ? 1 : -1 }
    const parsedTimestamp = timestamp ? timestamp : parsedOrder === 'desc' ? Date.now() : 0
    const _timestamp = parsedOrder === 'desc' ? { $lt: parsedTimestamp } : { $gt: parsedTimestamp }
    const filter: Filter<XyoPayloadWithMeta<EmptyObject>> = {
      ...props,
      _archive: archive,
      _timestamp,
    }
    if (hash) filter._hash = hash
    if (schema) filter.schema = schema
    if (schemas?.length) filter.schema = { $in: schemas }
    return (await this.sdk.find(filter)).sort(sort).limit(parsedLimit).maxTimeMS(2000).toArray()
  }
  async get(id: ArchivePayloadsArchivistId): Promise<XyoPayloadWithMeta[]> {
    const predicate = { _archive: assertEx(id.archive), _hash: assertEx(id.hash) }
    return (await this.sdk.find(predicate)).limit(1).toArray()
  }
  async insert(items: XyoPayloadWithMeta[]): Promise<XyoPayloadWithMeta[]> {
    const result = await this.sdk.insertMany(items.map(removeId) as XyoPayloadWithMeta[])
    if (result.insertedCount != items.length) {
      throw new Error('Error inserting Payloads')
    }
    return items
  }
}

exports = { MongoDBArchivePayloadsArchivist }
