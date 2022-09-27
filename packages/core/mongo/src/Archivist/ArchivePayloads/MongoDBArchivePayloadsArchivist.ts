import { assertEx } from '@xylabs/assert'
import { XyoAccount } from '@xyo-network/account'
import {
  AbstractPayloadArchivist,
  ArchiveModuleConfig,
  ArchivePayloadsArchivist,
  XyoPayloadFilterPredicate,
  XyoPayloadWithMeta,
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
export class MongoDBArchivePayloadsArchivist extends AbstractPayloadArchivist<XyoPayloadWithMeta> implements ArchivePayloadsArchivist {
  constructor(
    @inject(TYPES.Account) protected readonly account: XyoAccount,
    @inject(MONGO_TYPES.PayloadSdkMongo) protected sdk: BaseMongoSdk<XyoPayloadWithMeta>,
    protected readonly config: ArchiveModuleConfig,
  ) {
    super(account, config)
  }

  async find(predicate: XyoPayloadFilterPredicate): Promise<XyoPayloadWithMeta[]> {
    const { hash, limit, order, schema, schemas, timestamp, ...props } = predicate
    const parsedLimit = limit || 100
    const parsedOrder = order || 'desc'
    const sort: { [key: string]: SortDirection } = { _timestamp: parsedOrder === 'asc' ? 1 : -1 }
    const parsedTimestamp = timestamp ? timestamp : parsedOrder === 'desc' ? Date.now() : 0
    const _timestamp = parsedOrder === 'desc' ? { $lt: parsedTimestamp } : { $gt: parsedTimestamp }
    const filter: Filter<XyoPayloadWithMeta<EmptyObject>> = {
      ...props,
      _archive: this.config.archive,
      _timestamp,
    }
    if (hash) filter._hash = hash
    if (schema) filter.schema = schema
    if (schemas?.length) filter.schema = { $in: schemas }
    return (await (await this.sdk.find(filter)).sort(sort).limit(parsedLimit).maxTimeMS(2000).toArray()).map(removeId)
  }

  async get(ids: string[]): Promise<Array<XyoPayloadWithMeta | null>> {
    const predicates = ids.map((id) => {
      const _archive = assertEx(this.config.archive, 'MongoDBArchivePayloadsArchivist.get: Missing archive')
      const _hash = assertEx(id, 'MongoDBArchivePayloadsArchivist.get: Missing hash')
      return { _archive, _hash }
    })
    const queries = predicates.map(async (predicate) => {
      const result = (await (await this.sdk.find(predicate)).limit(1).toArray()).map(removeId)
      return result?.[0] || null
    })
    const results = await Promise.all(queries)
    return results
  }

  async insert(items: XyoPayloadWithMeta[]) {
    const payloads = items.map((p) => {
      return { ...p, _archive: this.config.archive, _hash: new PayloadWrapper(p).hash }
    })
    const result = await this.sdk.insertMany(payloads.map(removeId))
    if (result.insertedCount != items.length) {
      throw new Error('MongoDBArchivePayloadsArchivist.insert: Error inserting Payloads')
    }
    const [bw] = await this.bindPayloads(items)
    return bw
  }
}
