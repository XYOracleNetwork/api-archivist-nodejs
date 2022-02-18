import { asyncHandler, NoReqBody, NoReqQuery, NoResBody } from '@xylabs/sdk-api-express-ecs'
import { RequestHandler } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'

import { isValidArchiveName } from '../../lib'

type ArchivePathParams = {
  archive: string
}

interface ArchiveLocals {
  archive: string
}

const handler: RequestHandler<ArchivePathParams, NoResBody, NoReqBody, NoReqQuery, ArchiveLocals> = async (
  req,
  res,
  next
) => {
  const archive = req.params.archive?.toLowerCase()
  if (!isValidArchiveName(archive)) {
    next({ message: 'Invalid Archive Name', statusCode: StatusCodes.BAD_REQUEST })
    return
  }

  const response = await getArchiveByName(archive)
  if (!response) {
    next({ message: ReasonPhrases.NOT_FOUND, statusCode: StatusCodes.NOT_FOUND })
  }

  // TODO: Augment Locals with archive
  next()
}

export const archiveLocals = asyncHandler(handler)
