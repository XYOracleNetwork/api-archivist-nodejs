import { asyncHandler, NoReqBody, NoReqQuery } from '@xylabs/sdk-api-express-ecs'
import { XyoPayload } from '@xyo-network/sdk-xyo-client-js'
import { RequestHandler } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'

export type QueryPathParams = {
  id: string
}

const handler: RequestHandler<QueryPathParams, XyoPayload, NoReqBody, NoReqQuery> = async (req, res, next) => {
  const result = await req.app.responseQueue.tryDequeue(req.params.id)
  if (result === null) {
    next({ message: ReasonPhrases.ACCEPTED, statusCode: StatusCodes.ACCEPTED })
  } else if (result?.huri?.hash) {
    // TODO: Redirect to archive
    res.redirect(result.huri?.hash)
  }
  next({ message: ReasonPhrases.NOT_FOUND, statusCode: StatusCodes.NOT_FOUND })
}

export const getQuery = asyncHandler(handler)
