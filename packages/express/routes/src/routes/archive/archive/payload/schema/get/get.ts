import { asyncHandler } from '@xylabs/sdk-api-express-ecs'
import { ArchivePathParams } from '@xyo-network/archivist-model'
import { RequestHandler } from 'express'

const handler: RequestHandler<ArchivePathParams, string[]> = async (req, res) => {
  const { archive } = req.params
  const { archiveSchemaListDiviner } = req.app
  const result = await archiveSchemaListDiviner.find(archive)
  const schemas = result.pop() || []
  res.json(schemas)
}

export const getArchivePayloadSchemas = asyncHandler(handler)
