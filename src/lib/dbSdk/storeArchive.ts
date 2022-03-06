import { getArchivistArchiveMongoSdk } from './getArchivistArchiveMongoSdk'

export interface StoreArchiveRequest {
  archive: string
  user: string
  accessControl: boolean
}

export interface StoreArchiveResult extends StoreArchiveRequest {
  updated: boolean
}

/**
 * Stores ("claims" if unowned by any user/"updates" if already owned by the
 * same user) the archive and associated settings. Returns null if the operation
 * could not be completed because the archive is already owned by a different
 * user
 * @param request The archive to store
 * @returns The stored archive if the operation was successful, null if not
 */
export const storeArchive = async (request: StoreArchiveRequest): Promise<StoreArchiveResult | null> => {
  const sdk = await getArchivistArchiveMongoSdk()
  try {
    return await sdk.upsert(request)
  } catch (_error) {
    // NOTE: Possibly generated a duplicate key error if archive is already owned
  }
  return null
}
