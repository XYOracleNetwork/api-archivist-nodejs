import { NextFunction, Request, Response } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'

import { isValidArchiveName } from '../../lib'
import { storeArchiveOwner } from './storeArchiveOwner'

export const putArchive = async (req: Request, res: Response, next: NextFunction) => {
  const archive = req.params.archive?.toLowerCase()
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

  const response = await storeArchiveOwner(archive, user.id)
  if (response && response.owner === user.id) {
    res.json(response)
    next()
  } else {
    res.sendStatus(StatusCodes.UNAUTHORIZED)
    next({ message: ReasonPhrases.UNAUTHORIZED })
  }
}
