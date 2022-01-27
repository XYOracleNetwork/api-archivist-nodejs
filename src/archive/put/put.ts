import { NextFunction, Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'

import { getArchiveOwner } from './getArchiveOwner'
import { storeArchiveOwner } from './storeArchiveOwner'

export const putArchive = async (req: Request, res: Response, next: NextFunction) => {
  const { archive } = req.params
  const { user } = req
  if (!user || !user?.id) {
    res.sendStatus(StatusCodes.BAD_REQUEST)
    next({ message: 'Invalid User' })
    return
  }
  try {
    await storeArchiveOwner(archive, user.id)
    // Archive claimed by this user
    res.sendStatus(StatusCodes.NO_CONTENT)
    next()
  } catch (error) {
    // Get current archive owner
    const owner = await getArchiveOwner(archive)
    // If archive is not owned by this user
    if (!owner || owner !== user.id) {
      // User is not authorized to claim this archive
      res.sendStatus(StatusCodes.UNAUTHORIZED)
      next()
    } else {
      // Archive is already owned by this user
      res.sendStatus(StatusCodes.NO_CONTENT)
      next()
    }
  }
}
