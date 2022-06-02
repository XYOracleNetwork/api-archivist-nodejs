import { asyncHandler } from '@xylabs/sdk-api-express-ecs'
import { exists } from '@xylabs/sdk-js'
import { XyoBoundWitness, XyoBoundWitnessBuilder, XyoPayload, XyoPayloadBuilder } from '@xyo-network/sdk-xyo-client-js'
import { RequestHandler } from 'express'

import { PostNodePathParams } from '../model'

const unsupportedSchemaType = 'network.xyo.unsupported'
const responseSchemaType = 'network.xyo.command.response'

// TODO: CQRS pattern of returning empty for commands, redirect for queries
const handler: RequestHandler<PostNodePathParams, XyoBoundWitness[], XyoBoundWitness[]> = async (req, res, next) => {
  const archive = req.params.archive || 'temp'
  const { processors } = res.app.payloadProcessorRegistry
  const boundWitnesses: XyoBoundWitness[] = Array.isArray(req.body) ? req.body : [req.body]
  const result = boundWitnesses.map((boundWitness) => {
    boundWitness._archive = archive
    const payloads: XyoPayload[] = boundWitness._payloads?.filter(exists) || []
    return (
      payloads.map(async (p) => {
        p._archive = archive
        const processor = processors[p.schema]
        // TODO: Communicate response schema back from command/query result
        // TODO: Link response to requested payload
        return processor ? new XyoPayloadBuilder({ schema: responseSchemaType }).fields((await processor(p)) as Partial<XyoPayload>).build() : { schema: unsupportedSchemaType }
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
