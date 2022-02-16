import { RequestHandler } from 'express'
import { StatusCodes } from 'http-status-codes'

import { genericAsyncHandler, getArchivesByOwner, NoReqParams } from '../../lib'
import { IArchiveResponse } from '../archiveResponse'

const handler: RequestHandler<NoReqParams, IArchiveResponse[]> = async (req, res, next) => {
  const { user } = req
  if (!user || !user?.id) {
    next({ message: 'Invalid User', statusCode: StatusCodes.UNAUTHORIZED })
    return
  }
  res.json(await getArchivesByOwner(user.id))
  next()
}

export const getArchives = genericAsyncHandler(handler)
