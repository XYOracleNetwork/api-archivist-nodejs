import 'source-map-support/register'

import { asyncHandler } from '@xylabs/sdk-api-express-ecs'
import { ArchivePathParams, BoundWitnessStatsPayload, BoundWitnessStatsSchema } from '@xyo-network/archivist-model'
import { XyoDivinerDivineQuerySchema } from '@xyo-network/diviner'
import { XyoPayload } from '@xyo-network/payload'
import { RequestHandler } from 'express'

const unknownCount: BoundWitnessStatsPayload = { count: -1, schema: BoundWitnessStatsSchema }

export interface GetArchiveBlockStats {
  count: number
}

const handler: RequestHandler<ArchivePathParams, GetArchiveBlockStats> = async (req, res) => {
  const { archive } = req.params
  const { boundWitnessStatsDiviner: diviner } = req.app
  const payload: XyoPayload<{ archive: string }> = {
    archive,
    schema: 'xyo.network.mongo.archive',
  }
  const result = await diviner.query({
    payloads: [payload],
    schema: XyoDivinerDivineQuerySchema,
  })
  const answer: BoundWitnessStatsPayload = (result[1].pop() as BoundWitnessStatsPayload) || unknownCount
  res.json(answer)
}

export const getArchiveBlockStats = asyncHandler(handler)
