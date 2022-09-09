import 'source-map-support/register'

import { asyncHandler } from '@xylabs/sdk-api-express-ecs'
import {
  ArchivePathParams,
  BoundWitnessStatsPayload,
  BoundWitnessStatsQueryPayload,
  BoundWitnessStatsQuerySchema,
  BoundWitnessStatsSchema,
} from '@xyo-network/archivist-model'
import { XyoDivinerDivineQuerySchema } from '@xyo-network/diviner'
import { XyoModuleQueryResult } from '@xyo-network/module'
import { RequestHandler } from 'express'

const unknownCount: BoundWitnessStatsPayload = { count: -1, schema: BoundWitnessStatsSchema }

export interface GetArchiveBlockStats {
  count: number
}

const handler: RequestHandler<ArchivePathParams, GetArchiveBlockStats> = async (req, res) => {
  const { archive } = req.params
  const { boundWitnessStatsDiviner: diviner } = req.app
  const payloads: BoundWitnessStatsQueryPayload[] = [{ archive, schema: BoundWitnessStatsQuerySchema }]
  const query = { payloads, schema: XyoDivinerDivineQuerySchema }
  const result = (await diviner.query(query)) as XyoModuleQueryResult<BoundWitnessStatsPayload>
  const answer: BoundWitnessStatsPayload = result[1].pop() || unknownCount
  res.json(answer)
}

export const getArchiveBlockStats = asyncHandler(handler)
