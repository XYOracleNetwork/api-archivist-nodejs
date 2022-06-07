import { asyncHandler } from '@xylabs/sdk-api-express-ecs'
import { exists } from '@xylabs/sdk-js'
import { XyoBoundWitness, XyoBoundWitnessMeta, XyoPayload, XyoPayloadMeta, XyoPayloadWrapper } from '@xyo-network/sdk-xyo-client-js'
import { RequestHandler } from 'express'
import { StatusCodes } from 'http-status-codes'

import { PostNodePathParams } from '../model'
import { getRequestMetaData } from './getRequestMetaData'

const handler: RequestHandler<PostNodePathParams, string[][], XyoBoundWitness[]> = async (req, res, next) => {
  const boundWitnessMetaData: XyoBoundWitnessMeta = getRequestMetaData(req)
  const payloadMetaData: XyoPayloadMeta = { archive: boundWitnessMetaData._archive }
  const boundWitnesses: XyoBoundWitness[] = Array.isArray(req.body) ? req.body : [req.body]
  const queries = boundWitnesses.map<XyoBoundWitness>((boundWitness) => {
    const bw: XyoBoundWitness = { ...boundWitness, ...boundWitnessMetaData }
    bw._payloads =
      bw._payloads?.filter(exists).map<XyoPayload>((payload) => {
        const wrapper = new XyoPayloadWrapper(payload)
        return { ...payload, ...payloadMetaData, _hash: wrapper.hash }
      }) || []
    return bw
  })
  // TODO: Validate protocol only here: new XyoBoundWitnessWrapper(bw).validator.all()
  const { enqueue } = req.app.queryQueue
  const { converters } = req.app.queryConverters
  const queued = queries
    .map((bw) => bw._payloads)
    .filter(exists)
    .map((payloads) =>
      payloads
        .map((payload) => {
          const converter = converters[payload.schema]
          // TODO: Handle unsupported schema here
          return converter(payload, req)
        })
        .map(enqueue)
    )
  const result: string[][] = await Promise.all(queued.map(async (x) => await Promise.all(x)))
  res.status(StatusCodes.ACCEPTED).json(result)
  next()
}

export const postPayloads = asyncHandler(handler)
