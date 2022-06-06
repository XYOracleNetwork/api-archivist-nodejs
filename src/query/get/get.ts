import { asyncHandler, NoReqBody, NoReqQuery } from '@xylabs/sdk-api-express-ecs'
import { XyoPayload } from '@xyo-network/sdk-xyo-client-js'
import { RequestHandler } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'

export type QueryPathParams = {
  hash: string
}

const handler: RequestHandler<QueryPathParams, XyoPayload, NoReqBody, NoReqQuery> = async (req, _res, next) => {
  const result = await req.app.queryQueue.get(req.params.hash)
  if (result?._hash) {
    _res.redirect(result._hash)
  } else {
    // TODO: How to differentiate between not issued and not completed
    next({ message: ReasonPhrases.ACCEPTED, statusCode: StatusCodes.ACCEPTED })
  }
}

export const getQuery = asyncHandler(handler)
