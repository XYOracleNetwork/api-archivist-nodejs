import 'source-map-support/register'

import { asyncHandler } from '@xylabs/sdk-api-express-ecs'
import { ArchivePathParams, PayloadStatsPayload, PayloadStatsSchema } from '@xyo-network/archivist-model'
import { XyoDivinerDivineQuerySchema } from '@xyo-network/diviner'
import { XyoPayload } from '@xyo-network/payload'
import { RequestHandler } from 'express'

const unknownCount: PayloadStatsPayload = { count: -1, schema: PayloadStatsSchema }

export interface ArchivePayloadStats {
  count: number
}

const handler: RequestHandler<ArchivePathParams, ArchivePayloadStats> = async (req, res) => {
  const { archive } = req.params
  const { payloadStatsDiviner: diviner } = req.app
  const payload: XyoPayload<{ archive: string }> = {
    archive,
    schema: 'xyo.network.mongo.archive',
  }
  const result = await diviner.query({ payloads: [payload], schema: XyoDivinerDivineQuerySchema })
  const answer: PayloadStatsPayload = (result[1].pop() as PayloadStatsPayload) || unknownCount
  res.json(answer)
}

export const getArchivePayloadStats = asyncHandler(handler)
