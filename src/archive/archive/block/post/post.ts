import 'source-map-support/register'

import { asyncHandler } from '@xylabs/sdk-api-express-ecs'
import { XyoBoundWitnessWithMeta, XyoPayload } from '@xyo-network/sdk-xyo-client-js'
import { RequestHandler } from 'express'

import { getRequestMeta, prepareBoundWitnesses, validatePayloadSchema } from '../../../../lib'
import { ArchivePathParams } from '../../../../model'
import { storeBoundWitnesses } from './storeBoundWitnesses'
import { storePayloads } from './storePayloads'

const handler: RequestHandler<ArchivePathParams, XyoBoundWitnessWithMeta[], XyoBoundWitnessWithMeta | XyoBoundWitnessWithMeta[]> = async (req, res) => {
  const { archive } = req.params || 'temp'
  const [boundWitnessMeta, payloadMeta] = getRequestMeta(req)

  // Handle payload of single object or (preferred) array of bound witnesses
  const body: XyoBoundWitnessWithMeta[] = Array.isArray(req.body) ? req.body : [req.body]
  const { payloads, sanitized } = prepareBoundWitnesses(body, boundWitnessMeta, payloadMeta)

  payloads.forEach(async (payload) => {
    const valid = await validatePayloadSchema(payload)
    if (!valid) {
      const payloadWithExtraMeta = payload as XyoPayload<{ _schemaValid: boolean }>
      payloadWithExtraMeta._schemaValid = false
    }
  })

  await storeBoundWitnesses(archive, sanitized)
  if (payloads.length) {
    await storePayloads(archive, payloads)
  }
  res.json(sanitized)
}

export const postArchiveBlock = asyncHandler(handler)
