import 'source-map-support/register'

import { asyncHandler } from '@xylabs/sdk-api-express-ecs'
import { XyoBoundWitness } from '@xyo-network/sdk-xyo-client-js'
import { RequestHandler } from 'express'

import { prepareBoundWitnesses, validatePayloadSchema } from '../../../../lib'
import { ArchivePathParams } from '../../../../model'
import { storeBoundWitnesses } from './storeBoundWitnesses'
import { storePayloads } from './storePayloads'

const handler: RequestHandler<ArchivePathParams, XyoBoundWitness[], XyoBoundWitness | XyoBoundWitness[]> = async (req, res, next) => {
  const { archive } = req.params
  const _source_ip = req.ip ?? undefined
  const _user_agent = req.headers['User-agent'] ?? undefined
  const _timestamp = Date.now()

  // Handle payload of single object or (preferred) array of bound witnesses
  const body: XyoBoundWitness[] = Array.isArray(req.body) ? req.body : [req.body]
  const boundWitnessMetaData = { _source_ip, _timestamp, _user_agent }
  const payloadMetaData = { _archive: archive }
  const { payloads, sanitized } = prepareBoundWitnesses(body, boundWitnessMetaData, payloadMetaData)

  payloads.forEach(async (payload) => {
    const valid = await validatePayloadSchema(payload)
    if (!valid) {
      payload._schemaValid = false
    }
  })

  await storeBoundWitnesses(archive, sanitized)
  payloads.length ? await storePayloads(archive, payloads) : { insertedCount: 0 }
  res.json(sanitized)

  next()
}

export const postArchiveBlock = asyncHandler(handler)
