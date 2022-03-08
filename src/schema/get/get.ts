import { asyncHandler, NoReqParams } from '@xylabs/sdk-api-express-ecs'
import { delay } from '@xylabs/sdk-js'
import { XyoPayload } from '@xyo-network/sdk-xyo-client-js'
import { RequestHandler } from 'express'

const handler: RequestHandler<NoReqParams, XyoPayload[]> = async (req, res, next) => {
  res.json([])
  await delay(0)
  next()
}

export const getSchemas = asyncHandler(handler)
