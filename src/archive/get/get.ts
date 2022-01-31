import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import { getArchivesByOwner } from '../../lib'

export const getArchives = async (req: Request, res: Response, next: NextFunction) => {
  const { user } = req
  if (!user || !user?.id) {
    res.sendStatus(StatusCodes.BAD_REQUEST)
    next({ message: 'Invalid User' })
    return
  }
  const archives = await getArchivesByOwner(user.id)
  res.json(archives)
  next()
}
