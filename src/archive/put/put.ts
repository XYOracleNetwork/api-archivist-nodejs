import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import { storeArchiveOwner } from './storeArchiveOwner'
interface IUserWithId {
  id?: string
}
export const putArchiveOwner = async (req: Request, res: Response, next: NextFunction) => {
  const { archive } = req.params
  const user = req.user as IUserWithId
  if (!user || !user?.id) {
    res.sendStatus(StatusCodes.BAD_REQUEST)
    next({
      message: 'Invalid User',
    })
    return
  }
  // TODO: 200 vs 204 vs 404
  await storeArchiveOwner(archive, user.id)
  res.json({})

  next()
}
