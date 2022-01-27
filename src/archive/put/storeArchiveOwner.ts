import { getArchiveOwnerMongoSdk } from '../../lib'

export const storeArchiveOwner = async (archive: string, user: string): Promise<string | undefined> => {
  const sdk = await getArchiveOwnerMongoSdk()
  try {
    await sdk.insert({ _id: archive, user })
  } catch (_error) {
    // Possibly generated a duplicate key error if record already exists
  }
  const stored = await sdk.findByArchive(archive)
  return stored?.user
}
