import 'source-map-support/register'

import { asyncHandler } from '@xylabs/sdk-api-express-ecs'
import { assertEx } from '@xylabs/sdk-js'
import { RequestHandler } from 'express'

import { ArchivePathParams } from '../../../../../model'
import { witnessCurrentSchemaInArchive } from './witnessCurrentSchemaInArchive'

const handler: RequestHandler<ArchivePathParams> = async (req, res, next) => {
  const { archive } = req.params
  assertEx(archive, 'archive must be supplied')
  const schemas = (await witnessCurrentSchemaInArchive(archive)) || []
  res.json(schemas)
  next()
}

export const postArchiveSchemaCurrentWitness = asyncHandler(handler)
