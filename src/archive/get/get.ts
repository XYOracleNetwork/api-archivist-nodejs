import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import { getArchivesByOwner } from '../../lib'

export const getArchives = async (req: Request, res: Response, next: NextFunction) => {
  const { user } = req
  if (!user || !user?.id) {
    next({ message: 'Invalid User', statusCode: StatusCodes.UNAUTHORIZED })
    return
  }
  const archives = await getArchivesByOwner(user.id)
  res.json(archives)
  next()
}
