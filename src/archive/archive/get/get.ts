import { NoReqBody, NoReqQuery } from '@xylabs/sdk-api-express-ecs'
import { RequestHandler } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'

import { ArchiveLocals, ArchivePathParams, ArchiveResponse } from '../../../model'

const handler: RequestHandler<ArchivePathParams, ArchiveResponse, NoReqBody, NoReqQuery, ArchiveLocals> = (
  req,
  res,
  next
) => {
  const { archive } = res.locals
  if (!archive) {
    next({ message: ReasonPhrases.NOT_FOUND, statusCode: StatusCodes.NOT_FOUND })
  } else {
    res.json(archive)
    next()
  }
}

export const getArchive = handler
