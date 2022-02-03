import { NextFunction, Request, RequestHandler, Response } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'

export interface IPostArchiveSettingsKeysResponse {
  key: string
}

export const postArchiveSettingsKeys: RequestHandler = (
  req: Request,
  res: Response<IPostArchiveSettingsKeysResponse>,
  next: NextFunction
) => {
  const { user } = req
  if (!user || !user?.id) {
    next({ message: 'Invalid User', statusCode: StatusCodes.UNAUTHORIZED })
    return
  }
  next({ message: ReasonPhrases.NOT_IMPLEMENTED, statusCode: StatusCodes.NOT_IMPLEMENTED })
}
