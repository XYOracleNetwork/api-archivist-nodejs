import { getArchiveMongoSdk } from './getArchiveMongoSdk'

export const getArchivesByOwner = async (user: string): Promise<string[]> => {
  const sdk = await getArchiveMongoSdk()
  const userArchives = await sdk.findByUser(user)
  return userArchives.map((userArchive) => userArchive.archive)
}
