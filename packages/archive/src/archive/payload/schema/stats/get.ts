import { asyncHandler } from '@xylabs/sdk-api-express-ecs'
import { getPayloadSchemaCountsInArchive } from '@xyo-network/archivist-lib'
import { ArchivePathParams } from '@xyo-network/archivist-model'
import { RequestHandler } from 'express'

export interface ArchiveSchemaStatsResponse {
  counts: Record<string, number>
}

const handler: RequestHandler<ArchivePathParams, ArchiveSchemaStatsResponse> = async (req, res) => {
  const { archive } = req.params
  const counts = await getPayloadSchemaCountsInArchive(archive)
  res.json({ counts })
}

export const getArchivePayloadSchemaStats = asyncHandler(handler)
