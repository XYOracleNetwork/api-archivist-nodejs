import { assertEx } from '@xylabs/assert'
import { XyoAccount } from '@xyo-network/account'
import {
  AbstractPayloadArchivist,
  ArchivePayloadsArchivist,
  ArchivePayloadsArchivistId,
  XyoArchivePayloadFilterPredicate,
} from '@xyo-network/archivist-model'
import { TYPES } from '@xyo-network/archivist-types'
import { XyoBoundWitnessBuilder } from '@xyo-network/boundwitness'
import { EmptyObject } from '@xyo-network/core'
import { XyoPayloadWithMeta } from '@xyo-network/payload'
import { BaseMongoSdk } from '@xyo-network/sdk-xyo-mongo-js'
import { inject, injectable } from 'inversify'
import { Filter, SortDirection } from 'mongodb'

import { removeId } from '../../Mongo'
import { MONGO_TYPES } from '../../types'

@injectable()
export class MongoDBArchivePayloadsArchivist
  extends AbstractPayloadArchivist<XyoPayloadWithMeta, ArchivePayloadsArchivistId>
  implements ArchivePayloadsArchivist
{
  constructor(
    @inject(TYPES.Account) protected readonly account: XyoAccount,
    @inject(MONGO_TYPES.PayloadSdkMongo) protected sdk: BaseMongoSdk<XyoPayloadWithMeta>,
  ) {
    super(account)
  }

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

  async get(ids: ArchivePayloadsArchivistId[]): Promise<XyoPayloadWithMeta[]> {
    assertEx(ids.length === 1, 'Retrieval of multiple Payloads not supported')
    const id = assertEx(ids.pop(), 'Missing id')
    const predicate = { _archive: assertEx(id.archive), _hash: assertEx(id.hash) }
    return (await this.sdk.find(predicate)).limit(1).toArray()
  }

  async insert(items: XyoPayloadWithMeta[]) {
    const result = await this.sdk.insertMany(items.map(removeId) as XyoPayloadWithMeta[])
    if (result.insertedCount != items.length) {
      throw new Error('Error inserting Payloads')
    }
    return new XyoBoundWitnessBuilder({ inlinePayloads: false }).payloads(items).build()
  }
}
