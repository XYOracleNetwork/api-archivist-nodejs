import { getArchiveKeysMongoSdk } from '../../../../lib'

export const getArchiveKeys = async (archive: string): Promise<string[]> => {
  const sdk = await getArchiveKeysMongoSdk()
  const archiveKeys = await sdk.findByArchive(archive)
  return archiveKeys.map((archiveKey) => archiveKey.key)
}
