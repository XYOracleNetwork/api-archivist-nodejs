import { NextFunction, Request, RequestHandler, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import { isValidArchiveName } from '../../../../lib'
import { generateArchiveKey } from './generateArchiveKey'

export interface IPostArchiveSettingsKeysResponse {
  created: string
  key: string
}

export const postArchiveSettingsKeys: RequestHandler = async (
  req: Request,
  res: Response<IPostArchiveSettingsKeysResponse>,
  next: NextFunction
) => {
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
  res.json(response as IPostArchiveSettingsKeysResponse)
  next()
}
