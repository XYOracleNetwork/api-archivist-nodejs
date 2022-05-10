import { asyncHandler } from '@xylabs/sdk-api-express-ecs'
import { RequestHandler } from 'express'

import { getPayloadSchemaCountsInArchive } from '../../../../lib'
import { ArchivePathParams } from '../../../../model'

export interface ArchiveSchemaStatsResponse {
  counts: Record<string, number>
}

const handler: RequestHandler<ArchivePathParams, ArchiveSchemaStatsResponse> = async (req, res, next) => {
  const { archive } = req.params
  const counts = await getPayloadSchemaCountsInArchive(archive)
  res.json({ counts })
  next()
}

export const getArchiveSchemaStats = asyncHandler(handler)
