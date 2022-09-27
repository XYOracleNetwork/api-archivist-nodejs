import 'source-map-support/register'

import { asyncHandler } from '@xylabs/sdk-api-express-ecs'
import { XyoArchivistInsertQuery, XyoArchivistInsertQuerySchema } from '@xyo-network/archivist'
import { getRequestMeta } from '@xyo-network/archivist-express-lib'
import { prepareBoundWitnesses, validatePayloadSchema } from '@xyo-network/archivist-lib'
import { ArchivePathParams, XyoBoundWitnessWithMeta } from '@xyo-network/archivist-model'
import { BoundWitnessWrapper } from '@xyo-network/boundwitness'
import { QueryBoundWitnessBuilder } from '@xyo-network/module'
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
    return { ...bw, _archive: archive }
  })

  const boundWitnessQuery: XyoArchivistInsertQuery = {
    payloads: boundWitnessQueryPayloads.map((bw) => BoundWitnessWrapper.hash(bw)),
    schema: XyoArchivistInsertQuerySchema,
  }
  const boundWitnessQueryWitness = new BoundWitnessBuilder().payload(boundWitnessQuery).build()
  await archiveBoundWitnessArchivistFactory(archive).query(boundWitnessQueryWitness, boundWitnessQuery, boundWitnessQueryPayloads)

  const boundWitnessQueryWitness = new QueryBoundWitnessBuilder().query(PayloadWrapper.hash(boundWitnessQuery)).payload(boundWitnessQuery).build()
  await archiveBoundWitnessesArchivist.query(boundWitnessQueryWitness, [boundWitnessQuery, ...boundWitnessQueryPayloads])

  if (payloads.length) {
    const payloadsQueryPayloads = payloads.map((p) => {
      return { ...p, _archive: archive }
    })
    const payloadsQuery: XyoArchivistInsertQuery = {
      payloads: payloadsQueryPayloads.map((payload) => PayloadWrapper.hash(payload)),
      schema: XyoArchivistInsertQuerySchema,
    }
    await archivePayloadsArchivistFactory(archive).query(payloadsQueryWitness, payloadsQuery, payloadsQueryPayloads)
    const payloadsQueryWitness = new QueryBoundWitnessBuilder().query(PayloadWrapper.hash(payloadsQuery)).payload(payloadsQuery).build()
  }
  res.json(sanitized)
}

export const postArchiveBlock = asyncHandler(handler)
