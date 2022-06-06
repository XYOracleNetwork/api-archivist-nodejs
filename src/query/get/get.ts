import { asyncHandler, NoReqBody, NoReqQuery } from '@xylabs/sdk-api-express-ecs'
import { XyoPayload } from '@xyo-network/sdk-xyo-client-js'
import { RequestHandler } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'

export type QueryPathParams = {
  hash: string
}

const handler: RequestHandler<QueryPathParams, XyoPayload, NoReqBody, NoReqQuery> = (_req, _res, next) => {
  next({ message: ReasonPhrases.NOT_IMPLEMENTED, statusCode: StatusCodes.NOT_IMPLEMENTED })
}

export const getQuery = asyncHandler(handler)
