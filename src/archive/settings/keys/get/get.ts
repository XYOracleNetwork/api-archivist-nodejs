import { RequestHandler } from 'express'
import { StatusCodes } from 'http-status-codes'

import { genericAsyncHandler, getArchiveKeys, isValidArchiveName } from '../../../../lib'
import { ArchivePathParams } from '../../../archivePathParams'

export type GetArchiveSettingsKeysResponse = {
  created: string
  key: string
}[]

const handler: RequestHandler<ArchivePathParams, GetArchiveSettingsKeysResponse> = async (req, res, next) => {
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

  const keys = await getArchiveKeys(req.params.archive)
  res.json(keys)
  next()
}

export const getArchiveSettingsKeys = genericAsyncHandler(handler)
