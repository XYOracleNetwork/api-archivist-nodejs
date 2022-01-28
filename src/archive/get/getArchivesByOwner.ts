import { getArchiveOwnerMongoSdk } from '../../lib'

export const getArchivesByOwner = async (user: string): Promise<string[]> => {
  const sdk = await getArchiveOwnerMongoSdk()
  const userArchives = await sdk.findByUser(user)
  return userArchives.map((userArchive) => userArchive.archive)
}
