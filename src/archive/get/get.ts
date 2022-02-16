import { RequestHandler } from 'express'
import { StatusCodes } from 'http-status-codes'

import { genericAsyncHandler, getArchivesByOwner, NoReqParams } from '../../lib'

export type GetArchivesResponse = {
  archive: string
  user: string
  boundWitnessPrivate?: boolean
  payloadPrivate?: boolean
}[]

const handler: RequestHandler<NoReqParams, GetArchivesResponse> = async (req, res, next) => {
  const { user } = req
  if (!user || !user?.id) {
    next({ message: 'Invalid User', statusCode: StatusCodes.UNAUTHORIZED })
    return
  }
  const archives = await getArchivesByOwner(user.id)
  const response = archives.map((a) => {
    const { archive, user } = a
    let { boundWitnessPrivate, payloadPrivate } = a
    boundWitnessPrivate = boundWitnessPrivate ? boundWitnessPrivate : false
    payloadPrivate = payloadPrivate ? payloadPrivate : false
    return { archive, boundWitnessPrivate, payloadPrivate, user }
  })
  res.json(response)
  next()
}

export const getArchives = genericAsyncHandler(handler)
