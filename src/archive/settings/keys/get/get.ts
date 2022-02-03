import { NextFunction, Request, RequestHandler, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import { isValidArchiveName } from '../../../../lib'
import { getArchiveKeys } from './getArchiveKeys'

export interface IGetArchiveSettingsKeysResponse {
  created: string
  key: string
}

export const getArchiveSettingsKeys: RequestHandler = async (
  req: Request,
  res: Response<IGetArchiveSettingsKeysResponse[]>,
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

  const keys = await getArchiveKeys(req.params.archive)
  res.json(keys)
  next()
}
