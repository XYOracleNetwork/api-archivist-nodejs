import 'source-map-support/register'

import { asyncHandler } from '@xylabs/sdk-api-express-ecs'
import {
  ArchivePathParams,
  BoundWitnessStatsPayload,
  BoundWitnessStatsQueryPayload,
  BoundWitnessStatsQuerySchema,
  BoundWitnessStatsSchema,
} from '@xyo-network/archivist-model'
import { XyoDivinerQueryPayloadSchema } from '@xyo-network/sdk-xyo-client-js'
import { RequestHandler } from 'express'

const unknownCount: BoundWitnessStatsPayload = { count: -1, schema: BoundWitnessStatsSchema }

export interface GetArchiveBlockStats {
  count: number
}

const handler: RequestHandler<ArchivePathParams, GetArchiveBlockStats> = async (req, res) => {
  const { archive } = req.params
  const { boundWitnessStatsDiviner: diviner } = req.app
  const payload: BoundWitnessStatsQueryPayload = {
    archive,
    schema: BoundWitnessStatsQuerySchema,
  }
  const result = await diviner.query({
    payloads: [payload],
    schema: XyoDivinerQueryPayloadSchema,
  })
  const answer: BoundWitnessStatsPayload = (result[1].pop() as BoundWitnessStatsPayload) || unknownCount
  res.json(answer)
}

export const getArchiveBlockStats = asyncHandler(handler)
