import { getArchivistArchiveKeysMongoSdk } from './dbSdk'

export interface ArchiveKeyResult {
  archive: string
  created: string
  key: string
}

export const getArchiveKeys = async (archive: string): Promise<ArchiveKeyResult[]> => {
  const sdk = await getArchivistArchiveKeysMongoSdk()
  const archiveKeys = await sdk.findByArchive(archive)
  return archiveKeys.map<ArchiveKeyResult>((archiveKey) => {
    return { archive, created: archiveKey._id.getTimestamp().toISOString(), key: archiveKey.key }
  })
}
