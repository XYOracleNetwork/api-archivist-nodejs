import { NoReqBody, NoReqQuery, NoResBody } from '@xylabs/sdk-api-express-ecs'
import { Request } from 'express'

import { ArchiveLocals, ArchivePathParams } from '../../../../archive'

export const isArchiveOwner = (
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
