import { asyncHandler, NoReqBody, NoReqQuery } from '@xylabs/sdk-api-express-ecs'
import { dependencies } from '@xyo-network/archivist-dependencies'
import { IdentifiableHuri, Queue } from '@xyo-network/archivist-queue'
import { TYPES } from '@xyo-network/archivist-types'
import { XyoPayload } from '@xyo-network/payload'
import { RequestHandler } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'

export type QueryPathParams = {
  id: string
}

const handler: RequestHandler<QueryPathParams, XyoPayload, NoReqBody, NoReqQuery> = async (req, res, next) => {
  const result = await dependencies.get<Queue<IdentifiableHuri>>(TYPES.ResponseQueue).get(req.params.id)
  if (result?.huri?.hash) {
    res.redirect(`/${result.huri?.hash}`)
    return
  }
  // TODO: Differentiate between processing vs doesn't exist via null/undefined
  next({ message: ReasonPhrases.ACCEPTED, statusCode: StatusCodes.ACCEPTED })
}

export const getQuery = asyncHandler(handler)
