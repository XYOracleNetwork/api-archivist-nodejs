import { XyoArchive } from '@xyo-network/sdk-xyo-client-js'

import { getArchivistArchiveMongoSdk } from './getArchivistArchiveMongoSdk'

export interface StoreArchiveResult extends XyoArchive {
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
export const storeArchive = async (request: XyoArchive): Promise<StoreArchiveResult | null> => {
  const sdk = getArchivistArchiveMongoSdk()
  try {
    return await sdk.upsert(request)
  } catch (_error) {
    // NOTE: Possibly generated a duplicate key error if archive is already owned
  }
  return null
}
