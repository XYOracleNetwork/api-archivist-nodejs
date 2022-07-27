import 'source-map-support/register'

import { asyncHandler, tryParseInt } from '@xylabs/sdk-api-express-ecs'
import { assertEx } from '@xylabs/sdk-js'
import { getArchivistPayloadMongoSdk } from '@xyo-network/archivist-lib'
import { XyoPayload } from '@xyo-network/sdk-xyo-client-js'
import { RequestHandler } from 'express'

import { PayloadRecentPathParams } from './payloadRecentPathParams'

const getPayloads = async (archive: string, limit: number) => {
  const sdk = getArchivistPayloadMongoSdk(archive)
  return await sdk.findRecent(limit)
}

const handler: RequestHandler<PayloadRecentPathParams, XyoPayload[]> = async (req, res) => {
  const { archive, limit } = req.params
  const limitNumber = tryParseInt(limit) ?? 20
  assertEx(limitNumber > 0 && limitNumber <= 100, 'limit must be between 1 and 100')
  const payloads = await getPayloads(archive, limitNumber)
  res.json(payloads)
}

export const getArchivePayloadRecent = asyncHandler(handler)
