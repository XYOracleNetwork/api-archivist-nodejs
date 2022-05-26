import { asyncHandler, NoReqParams } from '@xylabs/sdk-api-express-ecs'
import { XyoBoundWitness, XyoBoundWitnessBuilder, XyoPayload, XyoPayloadBuilder } from '@xyo-network/sdk-xyo-client-js'
import { RequestHandler } from 'express'

// TODO: Move to SDK
export const exists = <T>(x: T | undefined): x is T => {
  return !!x
}

const unsupportedSchemaType = 'network.xyo.unsupported'
const responseSchemaType = 'network.xyo.command.response'

// TODO: CQRS pattern of returning empty for commands, redirect for queries
const handler: RequestHandler<NoReqParams, XyoBoundWitness[], XyoBoundWitness[]> = async (req, res, next) => {
  const { processors } = res.app.payloadProcessorRegistry
  const boundWitnesses: XyoBoundWitness[] = Array.isArray(req.body) ? req.body : [req.body]
  const result = boundWitnesses.map((boundWitness) => {
    const payloads: XyoPayload[] = boundWitness._payloads?.filter(exists) || []
    return (
      payloads.map(async (p) => {
        const processor = processors[p.schema]
        // TODO: Communicate response schema back from command/query result
        // TODO: Link response to requested payload
        return processor ? new XyoPayloadBuilder({ schema: 'todo' }).fields((await processor(p)) as Partial<XyoPayload>).build() : { schema: unsupportedSchemaType }
      }) || []
    )
  })
  const response: XyoBoundWitness[] = await Promise.all(
    result.map(async (x) => {
      const payloads: XyoPayload[] = await Promise.all(x)
      return new XyoBoundWitnessBuilder({ inlinePayloads: true }).payloads(payloads).build()
    })
  )
  res.json(response)
  next()
}

export const postPayloads = asyncHandler(handler)
