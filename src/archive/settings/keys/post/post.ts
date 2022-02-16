import { RequestHandler } from 'express'
import { StatusCodes } from 'http-status-codes'

import { genericAsyncHandler, isValidArchiveName } from '../../../../lib'
import { ArchivePathParams } from '../../../archivePathParams'
import { generateArchiveKey } from './generateArchiveKey'

export interface PostArchiveSettingsKeysResponse {
  created: string
  key: string
}

const handler: RequestHandler<ArchivePathParams, PostArchiveSettingsKeysResponse> = async (req, res, next) => {
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

  const response = await generateArchiveKey(archive)
  res.json(response)
  next()
}

export const postArchiveSettingsKeys = genericAsyncHandler(handler)
