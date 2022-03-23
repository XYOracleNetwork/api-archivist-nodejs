import { NoReqBody, NoReqQuery, NoResBody } from '@xylabs/sdk-api-express-ecs'
import { Request } from 'express'

import { ArchiveLocals, ArchivePathParams, ArchiveResult } from '../model'

export const isRequestUserOwnerOfArchive = (req: Request, archive: ArchiveResult): boolean => {
  const archiveOwnerId = archive?.user
  if (!archiveOwnerId) {
    console.log(`No Archive Owner: ${JSON.stringify(archive, null, 2)}`)
    return false
  }
  // Grab the user from the request (if this was an auth'd request)
  const reqUserId = req?.user?.id
  if (!reqUserId) return false

  return reqUserId === archiveOwnerId
}

export const isRequestUserOwnerOfRequestedArchive = (
  req: Request<ArchivePathParams, NoResBody, NoReqBody, NoReqQuery, ArchiveLocals>
): boolean => {
  // Get the archive from locals
  const record = req?.res?.locals?.archive

  // If the archive doesn't exist or have an owner, they are not the owner
  if (!record?.user) return false

  // If there's no user associated with this request, they're not the owner
  if (!req?.user?.id) return false

  // If the user from the request is the archive's owner
  return record.user === req.user.id
}
