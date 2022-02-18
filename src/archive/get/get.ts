import { asyncHandler, NoReqParams } from '@xylabs/sdk-api-express-ecs'
import { RequestHandler } from 'express'
import { StatusCodes } from 'http-status-codes'

import { getArchivesByOwner } from '../../lib'
import { ArchiveResponse } from '../archiveResponse'

const handler: RequestHandler<NoReqParams, ArchiveResponse[]> = async (req, res, next) => {
  const { user } = req
  if (!user || !user?.id) {
    next({ message: 'Invalid User', statusCode: StatusCodes.UNAUTHORIZED })
    return
  }
  res.json(await getArchivesByOwner(user.id))
  next()
}

export const getArchives = asyncHandler(handler)
