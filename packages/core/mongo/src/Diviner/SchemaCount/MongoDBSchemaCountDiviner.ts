import { SchemaCountDiviner } from '@xyo-network/archivist-model'

import { getArchivistPayloadMongoSdk } from '../../dbSdk'

interface PayloadSchemaCountsAggregateResult {
  _id: string
  count: number
}

export class MongoDBSchemaCountDiviner implements SchemaCountDiviner {
  async find(archive: string): Promise<Record<string, number>> {
    // TODO: Pass in via ctor as SDK or Archivist
    const sdk = getArchivistPayloadMongoSdk(archive)
    const result: PayloadSchemaCountsAggregateResult[] = await sdk.useCollection((collection) => {
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
