import { assertEx } from '@xylabs/assert'
import { XyoAccount } from '@xyo-network/account'
import {
  AbstractPayloadArchivist,
  ArchiveModuleConfig,
  ArchivePayloadsArchivist,
  ArchivePayloadsArchivistId,
  XyoArchivePayloadFilterPredicate,
  XyoPayloadWithMeta,
} from '@xyo-network/archivist-model'
import { TYPES } from '@xyo-network/archivist-types'
import { EmptyObject } from '@xyo-network/core'
import { XyoModuleConfigSchema } from '@xyo-network/module'
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
    protected readonly config: ArchiveModuleConfig = { archive: '', schema: XyoModuleConfigSchema },
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
      _archive: this.config.archive || archive,
      _timestamp,
    }
    if (hash) filter._hash = hash
    if (schema) filter.schema = schema
    if (schemas?.length) filter.schema = { $in: schemas }
    return (await (await this.sdk.find(filter)).sort(sort).limit(parsedLimit).maxTimeMS(2000).toArray()).map(removeId)
  }

  async get(ids: ArchivePayloadsArchivistId[]): Promise<Array<XyoPayloadWithMeta | null>> {
    const predicates = ids.map((id) => {
      const _archive = assertEx(this.config.archive || id.archive, 'MongoDBArchivePayloadsArchivist.get: Missing archive')
      const _hash = assertEx(id.hash, 'MongoDBArchivePayloadsArchivist.get: Missing hash')
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
    const result = await this.sdk.insertMany(items.map(removeId))
    if (result.insertedCount != items.length) {
      throw new Error('MongoDBArchivePayloadsArchivist.insert: Error inserting Payloads')
    }
    const [bw] = await this.bindPayloads(items)
    return bw
  }
}
