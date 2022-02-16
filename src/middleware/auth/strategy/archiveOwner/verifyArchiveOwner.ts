import { Request } from 'express'

import { getArchivesByOwner } from '../../../../lib'

export const verifyArchiveOwner = async (req: Request): Promise<boolean> => {
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
  const userArchives = await getArchivesByOwner(user.id)
  // Verify user owns archive from path
  return userArchives.some((userArchive) => userArchive.archive === archive)
}
