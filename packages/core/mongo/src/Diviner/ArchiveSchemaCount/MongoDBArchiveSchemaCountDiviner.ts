import 'reflect-metadata'

import { ArchiveSchemaCountDiviner } from '@xyo-network/archivist-model'
import { XyoPayload } from '@xyo-network/sdk-xyo-client-js'
import { BaseMongoSdk } from '@xyo-network/sdk-xyo-mongo-js'
import { inject, injectable } from 'inversify'

import { MONGO_TYPES } from '../../types'

interface PayloadSchemaCountsAggregateResult {
  _id: string
  count: number
}

@injectable()
class MongoDBArchiveSchemaCountDiviner implements ArchiveSchemaCountDiviner {
  constructor(@inject(MONGO_TYPES.PayloadSdkMongo) protected sdk: BaseMongoSdk<XyoPayload>) {}
  async find(archive: string): Promise<Record<string, number>> {
    const result: PayloadSchemaCountsAggregateResult[] = await this.sdk.useCollection((collection) => {
      return collection
        .aggregate()
        .match({ _archive: archive })
        .group<PayloadSchemaCountsAggregateResult>({
          _id: '$schema',
          count: {
            $sum: 1,
          },
        })
        .sort({ count: -1 })
        .toArray()
    })
    return result.reduce((o, schemaCount) => ({ ...o, [schemaCount._id]: schemaCount.count }), {})
  }
}

exports = { MongoDBArchiveSchemaCountDiviner }
