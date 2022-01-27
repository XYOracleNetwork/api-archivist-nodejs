import { getArchiveOwnerMongoSdk } from '../../lib'

export const getArchiveOwner = async (archive: string): Promise<string | undefined> => {
  const sdk = await getArchiveOwnerMongoSdk()
  const result = await sdk.findByArchive(archive)
  return result?.user
}
