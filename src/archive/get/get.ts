import { asyncHandler, NoReqParams } from '@xylabs/sdk-api-express-ecs'
import { RequestHandler } from 'express'

import { getArchivesByOwner } from '../../lib'
import { ArchiveResponse } from '../archiveResponse'

export const defaultPublicArchives: ArchiveResponse[] = [{ accessControl: false, archive: 'temp' }]

const handler: RequestHandler<NoReqParams, ArchiveResponse[]> = async (req, res, next) => {
  const { user } = req
  if (!user || !user?.id) {
    res.json(defaultPublicArchives)
  } else {
    res.json([...defaultPublicArchives, ...(await getArchivesByOwner(user.id))])
  }
  next()
}

export const getArchives = asyncHandler(handler)
