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

export interface PayloadSchemaCounts {
  _id: string
  count: number
}
/**
 * Find the distinct schemas in use by the archive
 * @param archive The name of the archive to search
 * @returns A list of all the distinct schemas in use by the payloads in the archive
 */
export const getPayloadSchemaCountsInArchive = (archive: string): Promise<PayloadSchemaCounts[]> => {
  const sdk = getArchivistPayloadMongoSdk(archive)
  return sdk.useCollection((collection) => {
    return collection
      .aggregate<PayloadSchemaCounts>([
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
}
