import 'source-map-support/register'

import { asyncHandler } from '@xylabs/sdk-api-express-ecs'
import { XyoArchivistInsertQuery, XyoArchivistInsertQuerySchema } from '@xyo-network/archivist'
import { getRequestMeta } from '@xyo-network/archivist-express-lib'
import { prepareBoundWitnesses, validatePayloadSchema } from '@xyo-network/archivist-lib'
import { ArchivePathParams, XyoBoundWitnessWithMeta } from '@xyo-network/archivist-model'
import { BoundWitnessBuilder, BoundWitnessWrapper } from '@xyo-network/boundwitness'
import { PayloadWrapper, XyoPayload } from '@xyo-network/payload'
import { RequestHandler } from 'express'

const handler: RequestHandler<ArchivePathParams, XyoBoundWitnessWithMeta[], XyoBoundWitnessWithMeta | XyoBoundWitnessWithMeta[]> = async (
  req,
  res,
) => {
  const { archive } = req.params || 'temp'
  const { archiveBoundWitnessArchivistFactory, archivePayloadsArchivistFactory } = req.app
  const [boundWitnessMeta, payloadMeta] = getRequestMeta(req)

  // Handle payload of single object or (preferred) array of bound witnesses
  const body: XyoBoundWitnessWithMeta[] = Array.isArray(req.body) ? req.body : [req.body]
  const { payloads, sanitized } = prepareBoundWitnesses(body, boundWitnessMeta, payloadMeta)

  payloads.forEach(async (payload) => {
    const valid = await validatePayloadSchema(payload)
    if (!valid) {
      const payloadWithExtraMeta = payload as XyoPayload<{ _schemaValid: boolean; schema: string }>
      payloadWithExtraMeta._schemaValid = false
    }
  })
  const boundWitnessQueryPayloads = sanitized.map((bw) => {
    return new BoundWitnessWrapper(bw).hash
  })
  const boundWitnessQuery: XyoArchivistInsertQuery = {
    payloads: boundWitnessQueryPayloads,
    schema: XyoArchivistInsertQuerySchema,
  }
  const boundWitnessQueryWitness = new BoundWitnessBuilder().payload(boundWitnessQuery).build()
  await archiveBoundWitnessArchivistFactory(archive).query(boundWitnessQueryWitness, boundWitnessQuery, sanitized)

  if (payloads.length) {
    const payloadsQueryPayloads = payloads.map((p) => {
      return new PayloadWrapper(p).hash
    })
    const payloadsQuery: XyoArchivistInsertQuery = {
      payloads: payloadsQueryPayloads,
      schema: XyoArchivistInsertQuerySchema,
    }
    const payloadsQueryWitness = new BoundWitnessBuilder().payload(boundWitnessQuery).build()
    await archivePayloadsArchivistFactory(archive).query(payloadsQueryWitness, payloadsQuery, payloads)
  }
  res.json(sanitized)
}

export const postArchiveBlock = asyncHandler(handler)
