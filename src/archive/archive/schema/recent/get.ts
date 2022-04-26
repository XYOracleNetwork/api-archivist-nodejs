import 'source-map-support/register'

import { asyncHandler, tryParseInt } from '@xylabs/sdk-api-express-ecs'
import { assertEx } from '@xylabs/sdk-js'
import { RequestHandler } from 'express'

import { getArchivistPayloadMongoSdk } from '../../../../lib'
import { ArchiveSchemaRecentPathParams } from './ArchiveSchemaRecentPathParams'

// TODO: Via SDK methods
// const getSchemas = async (limit: number) => {
//   const sdk = await getArchivistSchemaMongoSdk()
//   return await sdk.findRecent(limit)
// }

const getSchemas = async (archive: string, limit: number) => {
  const sdk = await getArchivistPayloadMongoSdk(archive)
  return (await sdk.find({ schema: 'schema' })).sort({ timestamp: -1 }).limit(limit)
}

const handler: RequestHandler<ArchiveSchemaRecentPathParams> = async (req, res, next) => {
  const { archive, limit } = req.params
  const limitNumber = tryParseInt(limit) ?? 20
  assertEx(limitNumber > 0 && limitNumber <= 100, 'limit must be between 1 and 100')
  const schemas = await getSchemas(archive, limitNumber)
  res.json(schemas?.map(({ _payloads, ...clean }) => clean))
  next()
}

export const getArchiveSchemaRecent = asyncHandler(handler)
