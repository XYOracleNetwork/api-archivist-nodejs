import { NoReqBody, NoReqQuery, NoResBody } from '@xylabs/sdk-api-express-ecs'
import { Request } from 'express'

import { isLegacyPrivateArchive } from '../../../../lib'
import { ArchiveLocals, ArchivePathParams } from '../../../../model'

export const isPublicArchive = (req: Request<ArchivePathParams, NoResBody, NoReqBody, NoReqQuery, ArchiveLocals>): boolean => {
  // Get the archive from locals
  const record = req?.res?.locals?.archive

  // If the archive doesn't exist it's not public
  if (!record) return false

  // If the archive exists, determine if it has any access controls
  const accessControl = isLegacyPrivateArchive(record)

  // If there are any access controls it's not a public archive
  return !accessControl
}
