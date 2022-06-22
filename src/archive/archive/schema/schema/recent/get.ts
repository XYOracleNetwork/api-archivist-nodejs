import 'source-map-support/register'

import { asyncHandler, tryParseInt } from '@xylabs/sdk-api-express-ecs'
import { assertEx } from '@xylabs/sdk-js'
import { RequestHandler } from 'express'

import { getArchivistPayloadMongoSdk } from '../../../../../lib'
import { ArchiveSchemaPayloadsRecentPathParams } from './ArchiveSchemaPayloadsRecentPathParams'

const getRecentPayloadsOfSchemaForArchive = async (archive: string, schema: string, limit: number) => {
  const sdk = getArchivistPayloadMongoSdk(archive)
  return (await sdk.find({ _archive: archive, schema })).sort({ timestamp: -1 }).limit(limit).toArray()
}

const handler: RequestHandler<ArchiveSchemaPayloadsRecentPathParams> = async (req, res) => {
  const { archive, schema, limit } = req.params
  const limitNumber = tryParseInt(limit) ?? 20
  assertEx(limitNumber > 0 && limitNumber <= 100, 'limit must be between 1 and 100')
  assertEx(schema, 'schema must be supplied')
  const schemas = (await getRecentPayloadsOfSchemaForArchive(archive, schema, limitNumber)) || []
  res.json(schemas)
}

export const getArchiveSchemaPayloadsRecent = asyncHandler(handler)
