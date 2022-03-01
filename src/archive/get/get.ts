import { asyncHandler, NoReqParams } from '@xylabs/sdk-api-express-ecs'
import { RequestHandler } from 'express'

import { getArchivesByOwner } from '../../lib'
import { ArchiveResponse } from '../archiveResponse'

const handler: RequestHandler<NoReqParams, ArchiveResponse[]> = async (req, res, next) => {
  const { user } = req
  if (!user || !user?.id) {
    //return the public discoverable archives without auth
    res.json([{ accessControl: false, archive: 'temp' }])
  } else {
    res.json(await getArchivesByOwner(user.id))
  }
  next()
}

export const getArchives = asyncHandler(handler)
