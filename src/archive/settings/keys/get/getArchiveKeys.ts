import { getArchiveKeysMongoSdk } from '../../../../lib'

export interface IGetArchiveKeyResult {
  archive: string
  created: string
  key: string
}

export const getArchiveKeys = async (archive: string): Promise<IGetArchiveKeyResult[]> => {
  const sdk = await getArchiveKeysMongoSdk()
  const archiveKeys = await sdk.findByArchive(archive)
  return archiveKeys.map<IGetArchiveKeyResult>((archiveKey) => {
    return { archive, created: archiveKey._id.getTimestamp().toISOString(), key: archiveKey.key }
  })
}
