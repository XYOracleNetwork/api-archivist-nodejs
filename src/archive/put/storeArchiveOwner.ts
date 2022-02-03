import { getArchiveOwnerMongoSdk } from '../../lib'

export interface IStoreArchiveOwnerResponse {
  archive: string
  owner: string
}

export const storeArchiveOwner = async (archive: string, user: string): Promise<IStoreArchiveOwnerResponse | null> => {
  const sdk = await getArchiveOwnerMongoSdk()
  try {
    await sdk.insert({ archive, user })
  } catch (_error) {
    // NOTE: Possibly generated a duplicate key error if archive is already owned
    // but at this point we don't know if the owner is already the desired owner
    // from the insert above
  }
  const archiveOwner = await sdk.findByArchive(archive)
  return archiveOwner ? { archive: archiveOwner.archive, owner: archiveOwner.user } : null
}
