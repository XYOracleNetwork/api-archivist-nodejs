import { asyncHandler } from '@xylabs/sdk-api-express-ecs'
import { ArchivePathParams } from '@xyo-network/archivist-model'
import { RequestHandler } from 'express'

const handler: RequestHandler<ArchivePathParams, string[]> = async (req, res) => {
  const { archive } = req.params
  const { archiveSchemaListDiviner } = req.app
  const schemas = await archiveSchemaListDiviner.find(archive)
  res.json(schemas)
}

export const getArchivePayloadSchemas = asyncHandler(handler)
