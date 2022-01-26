import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import { getArchivesByOwner } from './getArchivesByOwner'

interface IUserWithId {
  id?: string
}

export const getArchives = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as IUserWithId
  if (!user || !user?.id) {
    res.sendStatus(StatusCodes.BAD_REQUEST)
    next({
      message: 'Invalid User',
    })
    return
  }
  const archives = await getArchivesByOwner(user?.id)
  res.json(archives)
  next()
}
