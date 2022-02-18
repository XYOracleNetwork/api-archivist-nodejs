import { NoReqBody, NoReqQuery } from '@xylabs/sdk-api-express-ecs'
import { RequestHandler } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'

import { ArchiveLocals } from '../../../archiveLocals'
import { ArchivePathParams } from '../../../archivePathParams'
import { ArchiveResponse } from '../../../archiveResponse'

interface GetArchivePayloadsQueryParams extends NoReqQuery {
  orderBy: 'asc' | 'desc'
  hash: string
  limit: string
}

const handler: RequestHandler<
  ArchivePathParams,
  ArchiveResponse,
  NoReqBody,
  GetArchivePayloadsQueryParams,
  ArchiveLocals
> = (req, res, next) => {
  const { user } = req
  if (!user || !user?.id) {
    next({ message: 'Invalid User', statusCode: StatusCodes.UNAUTHORIZED })
    return
  }
  const { archive } = res.locals
  if (!archive) {
    next({ message: ReasonPhrases.NOT_FOUND, statusCode: StatusCodes.NOT_FOUND })
  }
  if (archive.user === user.id) {
    // res.json(archive)
    // next()
    next({ message: ReasonPhrases.NOT_IMPLEMENTED, statusCode: StatusCodes.NOT_IMPLEMENTED })
  } else {
    next({ message: ReasonPhrases.FORBIDDEN, statusCode: StatusCodes.FORBIDDEN })
  }
}

export const getArchivePayloads = handler
