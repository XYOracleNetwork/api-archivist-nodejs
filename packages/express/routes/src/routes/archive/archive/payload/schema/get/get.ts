import { asyncHandler } from '@xylabs/sdk-api-express-ecs'
import { ArchivePathParams, SchemaStatsPayload, SchemaStatsQueryPayload, SchemaStatsQuerySchema } from '@xyo-network/archivist-model'
import { XyoDivinerDivineQuerySchema } from '@xyo-network/diviner'
import { ModuleQueryResult, QueryBoundWitnessBuilder } from '@xyo-network/module'
import { RequestHandler } from 'express'

const handler: RequestHandler<ArchivePathParams, string[]> = async (req, res) => {
  const { archive } = req.params
  const { schemaStatsDiviner: diviner } = req.app
  const payloads: SchemaStatsQueryPayload[] = [{ archive, schema: SchemaStatsQuerySchema }]
  const query = { payloads, schema: XyoDivinerDivineQuerySchema }
  const bw = new QueryBoundWitnessBuilder().payload(query).build()
  const result = (await diviner.query(bw, [query])) as ModuleQueryResult<SchemaStatsPayload>
  const counts: Record<string, number> = result?.[1]?.[0]?.count || {}
  const schemas = Object.keys(counts)
  res.json(schemas)
}

/* @deprecated: Use schema stats instead and just make a list of stats keys */
export const getArchivePayloadSchemas = asyncHandler(handler)
