import { asyncHandler } from '@xylabs/sdk-api-express-ecs'
import { exists } from '@xylabs/sdk-js'
import { XyoBoundWitness, XyoBoundWitnessBuilder, XyoPayload, XyoPayloadBuilder } from '@xyo-network/sdk-xyo-client-js'
import { RequestHandler } from 'express'

import { PostNodePathParams } from '../model'
import { getRequestMetaData } from './getRequestMetaData'

const unsupportedSchemaType = 'network.xyo.unsupported'
const responseSchemaType = 'network.xyo.command.response'
const unsupportedSchemaResponse: XyoPayload = { schema: unsupportedSchemaType }

// TODO: CQRS pattern of returning empty for commands, redirect for queries
const handler: RequestHandler<PostNodePathParams, XyoBoundWitness[], XyoBoundWitness[]> = async (req, res, next) => {
  const { _archive, _source_ip, _timestamp, _user_agent } = getRequestMetaData(req)
  const boundWitnessMetaData = { _archive, _source_ip, _timestamp, _user_agent }
  const payloadMetaData = { _archive }
  const { processors } = res.app.payloadProcessorRegistry
  const boundWitnesses: XyoBoundWitness[] = Array.isArray(req.body) ? req.body : [req.body]
  const queries = boundWitnesses.map((boundWitness) => {
    const bw = { ...boundWitness, ...boundWitnessMetaData }
    const payloads: XyoPayload[] = bw._payloads?.filter(exists) || []
    return (
      payloads.map(async (payload) => {
        const p = { ...payload, ...payloadMetaData }
        const processor = processors[p.schema]
        // TODO: Communicate response schema back from command/query result
        // TODO: Link response to requested payload
        return processor ? new XyoPayloadBuilder({ schema: responseSchemaType }).fields((await processor(p)) as Partial<XyoPayload>).build() : unsupportedSchemaResponse
      }) || []
    )
  })
  const result: XyoBoundWitness[] = await Promise.all(queries.map(async (query) => new XyoBoundWitnessBuilder({ inlinePayloads: true }).payloads(await Promise.all(query)).build()))
  res.json(result)
  next()
}

export const postPayloads = asyncHandler(handler)
