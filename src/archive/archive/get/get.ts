import { asyncHandler } from '@xylabs/sdk-api-express-ecs'
import { RequestHandler } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'

import { isValidArchiveName } from '../../../lib'
import { ArchivePathParams } from '../../archivePathParams'
import { ArchiveResponse } from '../../archiveResponse'
import { getArchiveByName } from './getArchiveByName'

const handler: RequestHandler<ArchivePathParams, ArchiveResponse> = async (req, res, next) => {
  const { user } = req
  if (!user || !user?.id) {
    next({ message: 'Invalid User', statusCode: StatusCodes.UNAUTHORIZED })
    return
  }

  const archive = req.params.archive?.toLowerCase()
  if (!isValidArchiveName(archive)) {
    next({ message: 'Invalid Archive Name', statusCode: StatusCodes.BAD_REQUEST })
    return
  }

  const response = await getArchiveByName(archive)
  if (!response) {
    next({ message: ReasonPhrases.NOT_FOUND, statusCode: StatusCodes.NOT_FOUND })
  }
  if (response?.user === user.id) {
    res.json(response)
    next()
  } else {
    next({ message: ReasonPhrases.FORBIDDEN, statusCode: StatusCodes.FORBIDDEN })
  }
}

export const getArchive = asyncHandler(handler)
