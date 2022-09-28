import { asyncHandler } from '@xylabs/sdk-api-express-ecs'
import { ArchivePathParams, SchemaStatsQueryPayload, SchemaStatsQuerySchema } from '@xyo-network/archivist-model'
import { XyoDivinerWrapper } from '@xyo-network/diviner'
import { RequestHandler } from 'express'

export interface ArchiveSchemaStatsResponse {
  counts: Record<string, number>
}

const handler: RequestHandler<ArchivePathParams, ArchiveSchemaStatsResponse> = async (req, res) => {
  const { archive } = req.params
  const { schemaStatsDiviner: diviner } = req.app
  const payloads: SchemaStatsQueryPayload[] = [{ archive, schema: SchemaStatsQuerySchema }]
  const wrapper = new XyoDivinerWrapper(diviner)
  const result = await wrapper.divine(payloads)
  const counts = (result?.[0] as unknown as Record<string, number>)?.count || {}
  res.json({ counts })
}

export const getArchivePayloadSchemaStats = asyncHandler(handler)
