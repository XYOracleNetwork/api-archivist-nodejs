import { exists } from '@xylabs/exists'
import { asyncHandler } from '@xylabs/sdk-api-express-ecs'
import { XyoArchiveKey } from '@xyo-network/api'
import { isValidArchiveName } from '@xyo-network/archivist-lib'
import { ArchivePathParams } from '@xyo-network/archivist-model'
import { RequestHandler } from 'express'
import { StatusCodes } from 'http-status-codes'

const handler: RequestHandler<ArchivePathParams, XyoArchiveKey[]> = async (req, res, next) => {
  const { user } = req
  const { archiveKeyArchivist } = req.app
  if (!user || !user?.id) {
    next({ message: 'Invalid User', statusCode: StatusCodes.UNAUTHORIZED })
    return
  }

  const archive = req.params.archive?.toLowerCase()
  if (!isValidArchiveName(archive)) {
    next({ message: 'Invalid Archive Name', statusCode: StatusCodes.BAD_REQUEST })
    return
  }

  const keys = await archiveKeyArchivist.get([req.params.archive])
  res.json(keys.filter(exists))
}

export const getArchiveSettingsKeys = asyncHandler(handler)
