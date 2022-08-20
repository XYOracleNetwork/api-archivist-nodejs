import 'source-map-support/register'

import { asyncHandler } from '@xylabs/sdk-api-express-ecs'
import { ArchivePathParams, PayloadStatsPayload, PayloadStatsQuerySchema, PayloadStatsSchema } from '@xyo-network/archivist-model'
import { RequestHandler } from 'express'

const unknownCount: PayloadStatsPayload = { count: -1, schema: PayloadStatsSchema }
export interface ArchivePayloadStats {
  count: number
}

const handler: RequestHandler<ArchivePathParams, ArchivePayloadStats> = async (req, res) => {
  const { archive } = req.params
  const { payloadStatsDiviner } = req.app
  const result = await payloadStatsDiviner.query({ archive, schema: PayloadStatsQuerySchema })
  const answer: PayloadStatsPayload = (result[1].pop() as PayloadStatsPayload) || unknownCount
  res.json(answer)
}

export const getArchivePayloadStats = asyncHandler(handler)
