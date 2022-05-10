import { getArchivistPayloadMongoSdk } from '../dbSdk'

/**
 * Find the distinct schemas in use by the payloads in the archive
 * @param archive The name of the archive to search
 * @returns A list of all the distinct schemas in use by the payloads in the archive
 */
export const getPayloadSchemasInArchive = (archive: string): Promise<string[]> => {
  const sdk = getArchivistPayloadMongoSdk(archive)
  return sdk.useCollection((collection) => {
    return collection.distinct('schema')
  })
}
