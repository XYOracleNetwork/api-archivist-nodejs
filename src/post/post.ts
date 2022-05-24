import { asyncHandler, NoReqParams } from '@xylabs/sdk-api-express-ecs'
import { XyoPayload } from '@xyo-network/sdk-xyo-client-js'
import { RequestHandler } from 'express'

// TODO: CQRS pattern of returning empty for commands, redirect for queries
const handler: RequestHandler<NoReqParams, XyoPayload[], XyoPayload[]> = async (req, res, next) => {
  const { processors } = res.app.payloadProcessorRegistry
  const payloads: XyoPayload[] = Array.isArray(req.body) ? req.body : [req.body]
  const result: XyoPayload[] =
    (await Promise.all(
      payloads.map((p) => {
        const processor = processors[p.schema]
        return processor ? processor(p) : { schema: 'network.xyo.unsupported' }
      })
    )) || []
  res.json(result)
  next()
}

export const postPayloads = asyncHandler(handler)
