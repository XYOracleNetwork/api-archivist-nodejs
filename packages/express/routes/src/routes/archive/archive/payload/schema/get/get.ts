import { asyncHandler } from '@xylabs/sdk-api-express-ecs'
import { getPayloadSchemasInArchive } from '@xyo-network/archivist-lib'
import { ArchivePathParams } from '@xyo-network/archivist-model'
import { RequestHandler } from 'express'

const handler: RequestHandler<ArchivePathParams, string[]> = async (req, res) => {
  const { archive } = req.params
  const schemas = await getPayloadSchemasInArchive(archive)
  res.json(schemas)
}

export const getArchivePayloadSchemas = asyncHandler(handler)
