import { asyncHandler } from '@xylabs/sdk-api-express-ecs'
import { XyoArchive } from '@xyo-network/sdk-xyo-client-js'
import { RequestHandler } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'

import { determineArchiveAccessControl, isValidArchiveName, storeArchive } from '../../../lib'
import { ArchivePathParams } from '../../../model'

export interface PutArchiveRequest {
  accessControl: boolean
}

const handler: RequestHandler<ArchivePathParams, XyoArchive, PutArchiveRequest> = async (req, res, next) => {
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

  const accessControl = determineArchiveAccessControl(req.body)
  const result = await storeArchive({ accessControl, archive, user: user.id })
  if (result) {
    res.status(result.updated ? StatusCodes.OK : StatusCodes.CREATED).json(result)
    next()
  } else {
    next({ message: ReasonPhrases.FORBIDDEN, statusCode: StatusCodes.FORBIDDEN })
  }
}

export const putArchive = asyncHandler(handler)
