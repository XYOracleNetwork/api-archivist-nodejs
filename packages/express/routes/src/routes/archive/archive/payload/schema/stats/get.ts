import { asyncHandler } from '@xylabs/sdk-api-express-ecs'
import { ArchivePathParams } from '@xyo-network/archivist-model'
import { RequestHandler } from 'express'

export interface ArchiveSchemaStatsResponse {
  counts: Record<string, number>
}

const handler: RequestHandler<ArchivePathParams, ArchiveSchemaStatsResponse> = async (req, res) => {
  const { archive } = req.params
  const { archiveSchemaCountDiviner } = req.app
  const result = await archiveSchemaCountDiviner.find(archive)
  const counts = result.pop() || {}
  res.json({ counts })
}

export const getArchivePayloadSchemaStats = asyncHandler(handler)
