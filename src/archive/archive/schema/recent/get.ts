import 'source-map-support/register'

import { asyncHandler, tryParseInt } from '@xylabs/sdk-api-express-ecs'
import { assertEx } from '@xylabs/sdk-js'
import { RequestHandler } from 'express'

import { getArchivistPayloadMongoSdk } from '../../../../lib'
import { ArchiveSchemaRecentPathParams } from './ArchiveSchemaRecentPathParams'

const getRecentSchemasForArchive = async (archive: string, limit: number) => {
  const sdk = getArchivistPayloadMongoSdk(archive)
  return (await sdk.find({ _archive: archive, schema: 'network.xyo.schema' })).sort({ timestamp: -1 }).limit(limit).toArray()
}

const handler: RequestHandler<ArchiveSchemaRecentPathParams> = async (req, res) => {
  const { archive, limit } = req.params
  const limitNumber = tryParseInt(limit) ?? 20
  assertEx(limitNumber > 0 && limitNumber <= 100, 'limit must be between 1 and 100')
  const schemas = (await getRecentSchemasForArchive(archive, limitNumber)) || []
  res.json(schemas)
}

export const getArchiveSchemaRecent = asyncHandler(handler)
