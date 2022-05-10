import { asyncHandler } from '@xylabs/sdk-api-express-ecs'
import { RequestHandler } from 'express'

import { getPayloadSchemasInArchive } from '../../../../../lib'
import { ArchivePathParams } from '../../../../../model'

const handler: RequestHandler<ArchivePathParams, string[]> = async (req, res, next) => {
  const { archive } = req.params
  const schemas = await getPayloadSchemasInArchive(archive)
  res.json(schemas)
  next()
}

export const getArchivePayloadSchemas = asyncHandler(handler)
