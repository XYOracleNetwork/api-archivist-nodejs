import { RequestHandler } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'

import { genericAsyncHandler, isValidArchiveName } from '../../../lib'
import { ArchivePathParams } from '../../archivePathParams'
import { IArchiveResponse } from '../../archiveResponse'
import { storeArchive } from './storeArchive'

export interface IPutArchiveRequest {
  boundWitnessPrivate: boolean
  payloadPrivate: boolean
}

const handler: RequestHandler<ArchivePathParams, IArchiveResponse, IPutArchiveRequest> = async (req, res, next) => {
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

  const response = await storeArchive({ archive, user: user.id, ...req.body })
  if (response && response?.user === user.id) {
    res.json(response)
    next()
  } else {
    next({ message: ReasonPhrases.FORBIDDEN, statusCode: StatusCodes.FORBIDDEN })
  }
}

export const putArchive = genericAsyncHandler(handler)
