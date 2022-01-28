import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import { isValidArchiveName } from '../../lib'
import { storeArchiveOwner } from './storeArchiveOwner'

export const putArchive = async (req: Request, res: Response, next: NextFunction) => {
  const { archive } = req.params
  if (!isValidArchiveName(archive)) {
    res.sendStatus(StatusCodes.BAD_REQUEST)
    next({ message: 'Invalid Archive Name' })
    return
  }

  const { user } = req
  if (!user || !user?.id) {
    res.sendStatus(StatusCodes.BAD_REQUEST)
    next({ message: 'Invalid User' })
    return
  }

  const owner = await storeArchiveOwner(archive, user.id)
  const statusCode = owner && owner === user.id ? StatusCodes.NO_CONTENT : StatusCodes.UNAUTHORIZED
  res.sendStatus(statusCode)
  next()
}
