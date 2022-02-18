import { asyncHandler, NoReqBody, NoReqQuery, NoResBody } from '@xylabs/sdk-api-express-ecs'
import { RequestHandler } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'

import { ArchiveResult, getArchiveByName, isValidArchiveName } from '../../lib'

type ArchivePathParams = {
  archive?: string
}

interface ArchiveLocals {
  archive: ArchiveResult
}

const handler: RequestHandler<ArchivePathParams, NoResBody, NoReqBody, NoReqQuery, ArchiveLocals> = async (
  req,
  res,
  next
) => {
  // If there's an archive path param
  if (req.params.archive) {
    // Verify it's a valid archive name
    const archive = req.params.archive?.toLowerCase()
    if (!isValidArchiveName(archive)) {
      next({ message: 'Invalid Archive Name', statusCode: StatusCodes.BAD_REQUEST })
      return
    }
    // Lookup the archive
    const response = await getArchiveByName(archive)
    if (!response) {
      next({ message: ReasonPhrases.NOT_FOUND, statusCode: StatusCodes.NOT_FOUND })
    } else {
      res.locals.archive = response
    }
  }
  next()
}

/**
 * Augments each request with the archive from the path (if supplied)
 */
export const archiveLocals = asyncHandler(handler)
