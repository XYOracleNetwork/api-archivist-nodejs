import { asyncHandler } from '@xylabs/sdk-api-express-ecs'
import { ArchivePathParams, SchemaStatsPayload, SchemaStatsQueryPayload, SchemaStatsQuerySchema } from '@xyo-network/archivist-model'
import { BoundWitnessBuilder } from '@xyo-network/boundwitness'
import { XyoDivinerDivineQuerySchema } from '@xyo-network/diviner'
import { XyoModuleQueryResult } from '@xyo-network/module'
import { RequestHandler } from 'express'

const handler: RequestHandler<ArchivePathParams, string[]> = async (req, res) => {
  const { archive } = req.params
  const { schemaStatsDiviner: diviner } = req.app
  const payloads: SchemaStatsQueryPayload[] = [{ archive, schema: SchemaStatsQuerySchema }]
  const query = { payloads, schema: XyoDivinerDivineQuerySchema }
  const bw = new BoundWitnessBuilder().payload(query).build()
  const result = (await diviner.query(bw, query)) as XyoModuleQueryResult<SchemaStatsPayload>
  const counts: Record<string, number> = result?.[1]?.[0]?.count || {}
  const schemas = Object.keys(counts)
  res.json(schemas)
}

/* @deprecated: Use schema stats instead and just make a list of stats keys */
export const getArchivePayloadSchemas = asyncHandler(handler)
