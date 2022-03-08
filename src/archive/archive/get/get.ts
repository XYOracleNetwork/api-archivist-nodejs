import { NoReqBody, NoReqQuery } from '@xylabs/sdk-api-express-ecs'
import { RequestHandler } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'

import { ArchiveLocals } from '../../archiveLocals'
import { ArchivePathParams } from '../../archivePathParams'
import { ArchiveResponse } from '../../archiveResponse'

const handler: RequestHandler<ArchivePathParams, ArchiveResponse, NoReqBody, NoReqQuery, ArchiveLocals> = (
  req,
  res,
  next
) => {
  const { archive } = res.locals
  if (!archive) {
    next({ message: ReasonPhrases.NOT_FOUND, statusCode: StatusCodes.NOT_FOUND })
  }
  res.json(archive)
  next()
}

export const getArchive = handler
