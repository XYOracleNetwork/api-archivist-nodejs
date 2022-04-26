import 'source-map-support/register'

import { asyncHandler, tryParseInt } from '@xylabs/sdk-api-express-ecs'
import { assertEx } from '@xylabs/sdk-js'
import { RequestHandler } from 'express'

import { getArchivistAllPayloadMongoSdk } from '../../lib'
import { SchemaRecentPathParams } from './SchemaRecentPathParams'

// TODO: Via SDK methods
// const getSchemas = async (limit: number) => {
//   const sdk = await getArchivistSchemaMongoSdk()
//   return await sdk.findRecent(limit)
// }

const getSchemas = async (limit: number) => {
  const sdk = await getArchivistAllPayloadMongoSdk()
  return (await sdk.find({ schema: 'schema' })).sort({ timestamp: -1 }).limit(limit)
}

const handler: RequestHandler<SchemaRecentPathParams> = async (req, res, next) => {
  const { limit } = req.params
  const limitNumber = tryParseInt(limit) ?? 20
  assertEx(limitNumber > 0 && limitNumber <= 100, 'limit must be between 1 and 100')
  const schemas = await getSchemas(limitNumber)
  res.json(schemas?.map(({ _payloads, ...clean }) => clean))
  next()
}

export const getSchemaRecent = asyncHandler(handler)
