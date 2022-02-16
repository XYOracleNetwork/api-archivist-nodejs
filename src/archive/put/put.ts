import { asyncHandler } from '@xylabs/sdk-api-express-ecs'
import { NextFunction, Request, RequestHandler, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'

import { isValidArchiveName } from '../../lib'
import { storeArchive } from './storeArchive'

export interface IPutArchivePathParams extends ParamsDictionary {
  archive: string
}

export interface IPutArchiveRequest {
  boundWitnessPrivate: boolean
  payloadPrivate: boolean
}

export interface IPutArchiveResponse extends IPutArchiveRequest {
  archive: string
  user: string
}

export const handler: RequestHandler<IPutArchivePathParams, IPutArchiveResponse, IPutArchiveRequest> = async (
  req: Request<IPutArchivePathParams>,
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

  const response = await storeArchive({ archive, user: user.id, ...req.body })
  if (response && response?.user === user.id) {
    res.json(response)
    next()
  } else {
    next({ message: ReasonPhrases.FORBIDDEN, statusCode: StatusCodes.FORBIDDEN })
  }
}

export const putArchive: RequestHandler<IPutArchivePathParams, IPutArchiveResponse, IPutArchiveRequest> = asyncHandler(
  handler as RequestHandler
)
