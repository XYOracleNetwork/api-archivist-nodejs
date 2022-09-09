import { asyncHandler } from '@xylabs/sdk-api-express-ecs'
import { ArchivePathParams, SchemaStatsPayload, SchemaStatsQueryPayload, SchemaStatsQuerySchema } from '@xyo-network/archivist-model'
import { XyoDivinerDivineQuerySchema } from '@xyo-network/diviner'
import { XyoModuleQueryResult } from '@xyo-network/module'
import { RequestHandler } from 'express'

export interface ArchiveSchemaStatsResponse {
  counts: Record<string, number>
}

const handler: RequestHandler<ArchivePathParams, ArchiveSchemaStatsResponse> = async (req, res) => {
  const { archive } = req.params
  const { schemaStatsDiviner: diviner } = req.app
  const payloads: SchemaStatsQueryPayload[] = [{ archive, schema: SchemaStatsQuerySchema }]
  const query = { payloads, schema: XyoDivinerDivineQuerySchema }
  const result = (await diviner.query(query)) as XyoModuleQueryResult<SchemaStatsPayload>
  const counts: Record<string, number> = result?.[1]?.[0]?.count || {}
  res.json({ counts })
}

export const getArchivePayloadSchemaStats = asyncHandler(handler)
