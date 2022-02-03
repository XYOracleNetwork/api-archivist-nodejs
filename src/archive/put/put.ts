import { NextFunction, Request, RequestHandler, Response } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'

import { isValidArchiveName } from '../../lib'
import { storeArchiveOwner } from './storeArchiveOwner'

export interface IPutArchiveResponse {
  archive: string
  owner: string
}

export const putArchive: RequestHandler = async (
  req: Request,
  res: Response<IPutArchiveResponse>,
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

  const response = await storeArchiveOwner(archive, user.id)
  if (response && response?.owner === user.id) {
    res.json(response as IPutArchiveResponse)
    next()
  } else {
    next({ message: ReasonPhrases.CONFLICT, statusCode: StatusCodes.CONFLICT })
  }
}
