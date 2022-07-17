import { asyncHandler, NoReqBody, NoReqQuery } from '@xylabs/sdk-api-express-ecs'
import { XyoPayload } from '@xyo-network/sdk-xyo-client-js'
import { RequestHandler } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'

import { dependencies } from '../../Dependencies'
import { IdentifiableHuri, Queue } from '../../Queue'

export type QueryPathParams = {
  id: string
}

const handler: RequestHandler<QueryPathParams, XyoPayload, NoReqBody, NoReqQuery> = async (req, res, next) => {
  const result = await dependencies.get<Queue<IdentifiableHuri>>('Queue<IdentifiableHuri>').get(req.params.id)
  if (result?.huri?.hash) {
    res.redirect(`/${result.huri?.hash}`)
    return
  }
  // TODO: Differentiate between processing vs doesn't exist via null/undefined
  next({ message: ReasonPhrases.ACCEPTED, statusCode: StatusCodes.ACCEPTED })
}

export const getQuery = asyncHandler(handler)
