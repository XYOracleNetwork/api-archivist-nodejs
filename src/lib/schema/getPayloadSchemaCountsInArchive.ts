import { getArchivistPayloadMongoSdk } from '../dbSdk'

interface PayloadSchemaCountsAggregateResult {
  _id: string
  count: number
}

/**
 * Find the distinct schemas & their counts in use by the payloads in the archive
 * @param archive The name of the archive to search
 * @returns A list of all the distinct schemas & their counts in use by the payloads in the archive
 */
export const getPayloadSchemaCountsInArchive = async (archive: string): Promise<Record<string, number>> => {
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
