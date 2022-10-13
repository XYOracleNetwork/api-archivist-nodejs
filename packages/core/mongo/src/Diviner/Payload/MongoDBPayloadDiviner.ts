import 'reflect-metadata'

import { XyoAccount } from '@xyo-network/account'
import { isPayloadQueryPayload, PayloadDiviner, PayloadQueryPayload, XyoPayloadWithMeta } from '@xyo-network/archivist-model'
import { TYPES } from '@xyo-network/archivist-types'
import { XyoArchivistPayloadDivinerConfigSchema, XyoDiviner } from '@xyo-network/diviner'
import { XyoPayload, XyoPayloads } from '@xyo-network/payload'
import { BaseMongoSdk } from '@xyo-network/sdk-xyo-mongo-js'
import { Job, JobProvider, Logger } from '@xyo-network/shared'
import { inject, injectable } from 'inversify'
import { Filter, SortDirection } from 'mongodb'

import { DefaultLimit, DefaultMaxTimeMS, DefaultOrder } from '../../defaults'
import { removeId } from '../../Mongo'
import { MONGO_TYPES } from '../../types'

@injectable()
export class MongoDBPayloadDiviner extends XyoDiviner implements PayloadDiviner, JobProvider {
  constructor(
    @inject(TYPES.Logger) protected logger: Logger,
    @inject(TYPES.Account) account: XyoAccount,
    @inject(MONGO_TYPES.PayloadSdkMongo) protected readonly sdk: BaseMongoSdk<XyoPayloadWithMeta>,
  ) {
    super({ schema: XyoArchivistPayloadDivinerConfigSchema }, account)
  }

  get jobs(): Job[] {
    return [
      // {
      //   name: 'MongoDBPayloadDiviner.DivineBatch',
      //   schedule: '10 minute',
      //   task: async () => await this.divineArchivesBatch(),
      // },
    ]
  }

  override async divine(payloads?: XyoPayloads): Promise<XyoPayloads<XyoPayload>> {
    const query = payloads?.find<PayloadQueryPayload>(isPayloadQueryPayload)
    // TODO: Support multiple queries
    if (!query) return []
    const { archive, archives, hash, limit, order, schema, timestamp, ...props } = query
    const parsedLimit = limit || DefaultLimit
    const parsedOrder = order || DefaultOrder
    const sort: { [key: string]: SortDirection } = { _timestamp: parsedOrder === 'asc' ? 1 : -1 }
    const filter: Filter<XyoPayloadWithMeta> = { ...props }
    if (timestamp) {
      const parsedTimestamp = timestamp ? timestamp : parsedOrder === 'desc' ? Date.now() : 0
      filter._timestamp = parsedOrder === 'desc' ? { $lt: parsedTimestamp } : { $gt: parsedTimestamp }
    }
    if (archive) filter._archive = archive
    if (archives?.length) filter._archive = { $in: archives }
    if (hash) filter._hash = hash
    if (schema) filter.schema = schema
    return (await (await this.sdk.find(filter)).sort(sort).limit(parsedLimit).maxTimeMS(DefaultMaxTimeMS).toArray()).map(removeId)
  }

  override async initialize(): Promise<void> {
    // await this.registerWithChangeStream()
  }

  override async shutdown(): Promise<void> {
    // await this.changeStream?.close()
  }
}
