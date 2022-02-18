import { NoReqBody, NoReqQuery, NoResBody } from '@xylabs/sdk-api-express-ecs'
import { Request } from 'express'

import { ArchiveLocals, ArchivePathParams } from '../../../../archive'
import { determineArchiveAccessControl } from '../../../../lib'

export const verifyArchiveAccess = (
  req: Request<ArchivePathParams, NoResBody, NoReqBody, NoReqQuery, ArchiveLocals>
): boolean => {
  // Get the archive from locals
  const record = req?.res?.locals?.archive

  // If the archive doesn't exist they can't access it
  if (!record) return false

  // If the archive exists, determine if it has any access controls
  const accessControl = determineArchiveAccessControl(record)

  // If there are any access controls don't allow anonymous access
  return !accessControl
}
