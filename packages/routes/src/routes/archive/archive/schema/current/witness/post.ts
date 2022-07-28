import 'source-map-support/register'

import { asyncHandler } from '@xylabs/sdk-api-express-ecs'
import { assertEx } from '@xylabs/sdk-js'
import { ArchivePathParams } from '@xyo-network/archivist-model'
import { RequestHandler } from 'express'

import { witnessCurrentSchemaInArchive } from './witnessCurrentSchemaInArchive'

const handler: RequestHandler<ArchivePathParams> = async (req, res) => {
  const { archive } = req.params
  assertEx(archive, 'archive must be supplied')
  const schemas = (await witnessCurrentSchemaInArchive(archive)) || []
  res.json(schemas)
}

export const postArchiveSchemaCurrentWitness = asyncHandler(handler)
