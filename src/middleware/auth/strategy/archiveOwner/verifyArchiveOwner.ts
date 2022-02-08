import { Request } from 'express'

import { IArchiveOwnerStore } from '../../model'

export const verifyArchiveOwner = async (req: Request, store: IArchiveOwnerStore): Promise<boolean> => {
  // Validate user from request
  const { user } = req
  if (!user || !user?.id) {
    return false
  }
  // Validate archive from request
  const { archive } = req.params
  if (!archive) {
    return false
  }
  // Get archives owned by the user
  const userArchives = await store.getArchivesOwnedByUser(user.id)
  // Verify user owns archive from path
  return userArchives.some((userArchive) => userArchive === archive)
}
