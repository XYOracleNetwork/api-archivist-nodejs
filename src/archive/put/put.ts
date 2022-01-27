import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import { storeArchiveOwner } from './storeArchiveOwner'

export const putArchive = async (req: Request, res: Response, next: NextFunction) => {
  const { archive } = req.params
  const { user } = req
  if (!user || !user?.id) {
    res.sendStatus(StatusCodes.BAD_REQUEST)
    next({ message: 'Invalid User' })
    return
  }
  await storeArchiveOwner(archive, user.id)
  res.sendStatus(StatusCodes.NO_CONTENT)
  next()
}
