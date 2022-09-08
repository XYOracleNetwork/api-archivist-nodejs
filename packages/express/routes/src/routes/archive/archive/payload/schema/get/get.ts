import { asyncHandler } from '@xylabs/sdk-api-express-ecs'
import { ArchivePathParams } from '@xyo-network/archivist-model'
import { RequestHandler } from 'express'

const handler: RequestHandler<ArchivePathParams, string[]> = async (req, res) => {
  const { archive } = req.params
  const { archiveSchemaCountDiviner } = req.app
  const result = await archiveSchemaCountDiviner.find(archive)
  const counts = result?.pop()
  const schemas = counts ? Object.keys(counts) : []
  res.json(schemas)
}

/* @deprecated: Use schema stats instead and just make a list of stats keys */
export const getArchivePayloadSchemas = asyncHandler(handler)
