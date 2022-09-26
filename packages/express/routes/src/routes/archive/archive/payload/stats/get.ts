import 'source-map-support/register'

import { asyncHandler } from '@xylabs/sdk-api-express-ecs'
import {
  ArchivePathParams,
  PayloadStatsPayload,
  PayloadStatsQueryPayload,
  PayloadStatsQuerySchema,
  PayloadStatsSchema,
} from '@xyo-network/archivist-model'
import { XyoDivinerDivineQuerySchema } from '@xyo-network/diviner'
import { ModuleQueryResult, QueryBoundWitnessBuilder } from '@xyo-network/module'
import { RequestHandler } from 'express'

const unknownCount: PayloadStatsPayload = { count: -1, schema: PayloadStatsSchema }

export interface ArchivePayloadStats {
  count: number
}

const handler: RequestHandler<ArchivePathParams, ArchivePayloadStats> = async (req, res) => {
  const { archive } = req.params
  const { payloadStatsDiviner: diviner } = req.app
  const payloads: PayloadStatsQueryPayload[] = [{ archive, schema: PayloadStatsQuerySchema }]
  const query = { payloads, schema: XyoDivinerDivineQuerySchema }
  const bw = new QueryBoundWitnessBuilder().payload(query).build()
  const result = (await diviner.query(bw, [query])) as ModuleQueryResult<PayloadStatsPayload>
  const answer: PayloadStatsPayload = result?.[1]?.[0] || unknownCount
  res.json(answer)
}

export const getArchivePayloadStats = asyncHandler(handler)
