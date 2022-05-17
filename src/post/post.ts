import { asyncHandler, NoReqParams } from '@xylabs/sdk-api-express-ecs'
import { XyoPayload } from '@xyo-network/sdk-xyo-client-js'
import { RequestHandler } from 'express'

const handler: RequestHandler<NoReqParams, XyoPayload[], XyoPayload[]> = async (req, res, next) => {
  const { processors } = res.app.schemaHandlerRegistry
  const payloads = req.body
  const result: XyoPayload[] = (await Promise.all(payloads.map((p) => processors[p.schema](p)))) || []
  res.json(result)
  next()
}

export const postPayload = asyncHandler(handler)
