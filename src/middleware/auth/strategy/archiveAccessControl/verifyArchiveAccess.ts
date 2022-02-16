import { Request } from 'express'

import { getArchiveByName } from '../../../../archive'
import { determineArchiveAccessControl } from '../../../../lib'

export const verifyArchiveAccess = async (req: Request): Promise<boolean> => {
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
  const record = await getArchiveByName(archive)

  // If the archive doesn't exist they can't access it
  if (!record) return false

  // If the archive exists, determine if it has any access controls
  const accessControl = determineArchiveAccessControl(record)

  // If there are any access controls we won't allow anonymous access
  return accessControl ? false : true
}
