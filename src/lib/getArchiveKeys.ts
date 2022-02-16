import { getArchivistArchiveKeysMongoSdk } from './dbSdk'

export interface IArchiveKeyResult {
  archive: string
  created: string
  key: string
}

export const getArchiveKeys = async (archive: string): Promise<IArchiveKeyResult[]> => {
  const sdk = await getArchivistArchiveKeysMongoSdk()
  const archiveKeys = await sdk.findByArchive(archive)
  return archiveKeys.map<IArchiveKeyResult>((archiveKey) => {
    return { archive, created: archiveKey._id.getTimestamp().toISOString(), key: archiveKey.key }
  })
}
