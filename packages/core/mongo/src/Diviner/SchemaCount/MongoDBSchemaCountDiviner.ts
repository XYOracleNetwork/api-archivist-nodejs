import { SchemaCountDiviner } from '@xyo-network/archivist-model'
import { TYPES } from '@xyo-network/archivist-types'
import { XyoPayload } from '@xyo-network/sdk-xyo-client-js'
import { BaseMongoSdk } from '@xyo-network/sdk-xyo-mongo-js'
import { inject, injectable } from 'inversify'

interface PayloadSchemaCountsAggregateResult {
  _id: string
  count: number
}

@injectable()
export class MongoDBSchemaCountDiviner implements SchemaCountDiviner {
  constructor(@inject(TYPES.PayloadSdkMongo) protected readonly sdk: BaseMongoSdk<XyoPayload>) {}
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
