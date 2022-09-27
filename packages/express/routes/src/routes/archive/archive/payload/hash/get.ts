import 'source-map-support/register'

import { asyncHandler } from '@xylabs/sdk-api-express-ecs'
import { exists } from '@xylabs/sdk-js'
import { XyoArchivistGetQuery, XyoArchivistGetQuerySchema } from '@xyo-network/archivist'
import { QueryBoundWitnessBuilder } from '@xyo-network/module'
import { PayloadWrapper, XyoPayload } from '@xyo-network/payload'
import { RequestHandler } from 'express'

import { PayloadHashPathParams } from '../payloadHashPathParams'

const handler: RequestHandler<PayloadHashPathParams, XyoPayload[]> = async (req, res) => {
  const { archive, hash } = req.params
  const { archivePayloadsArchivistFactory } = req.app
  const query: XyoArchivistGetQuery = {
    hashes: [{ archive, hash }] as unknown as string[],
    schema: XyoArchivistGetQuerySchema,
  }
  const bw = new QueryBoundWitnessBuilder().query(PayloadWrapper.hash(query)).payload(query).build()
  const result = await archivePayloadsArchivistFactory(archive).query(bw, query)
  const payload = result?.[1].filter(exists).map((payload) => new PayloadWrapper(payload).body)?.[0]
  res.json(payload ? [payload] : [])
}

export const getArchivePayloadHash = asyncHandler(handler)
