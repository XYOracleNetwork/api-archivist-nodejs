import { getArchivistPayloadMongoSdk } from './dbSdk'

export const getSchemasInArchive = ''

/**
 * Find the distinct schemas in use by the archive
 * @param archive The name of the archive to search
 * @returns A list of all the distinct schemas in use by the payloads in the archive
 */
export const getPayloadSchemasInArchive = (archive: string): Promise<string[]> => {
  const sdk = getArchivistPayloadMongoSdk(archive)
  return sdk.useCollection((collection) => {
    return collection.distinct('schema')
  })
}

interface PayloadSchemaCountsAggregateResult {
  _id: string
  count: number
}
/**
 * Find the distinct schemas in use by the archive
 * @param archive The name of the archive to search
 * @returns A list of all the distinct schemas in use by the payloads in the archive
 */
export const getPayloadSchemaCountsInArchive = async (archive: string): Promise<Record<string, number>> => {
  const sdk = getArchivistPayloadMongoSdk(archive)
  const result: PayloadSchemaCountsAggregateResult[] = await sdk.useCollection((collection) => {
    return collection
      .aggregate<PayloadSchemaCountsAggregateResult>([
        {
          $group: {
            _id: '$schema',
            count: {
              $sum: 1,
            },
          },
        },
        {
          $sort: {
            count: -1,
          },
        },
      ])
      .toArray()
  })
  return result.reduce((o, schemaCount) => ({ ...o, [schemaCount._id]: schemaCount.count }), {})
}
