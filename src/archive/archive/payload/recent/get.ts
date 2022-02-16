import 'source-map-support/register'

import { tryParseInt } from '@xylabs/sdk-api-express-ecs'
import { assertEx } from '@xylabs/sdk-js'
import { XyoPayload } from '@xyo-network/sdk-xyo-client-js'
import { RequestHandler } from 'express'

import { genericAsyncHandler, getArchivistPayloadMongoSdk } from '../../../../lib'
import { PayloadRecentPathParams } from './payloadRecentPathParams'

const getPayloads = async (archive: string, limit: number) => {
  const sdk = await getArchivistPayloadMongoSdk(archive)
  return await sdk.findRecent(limit)
}

const handler: RequestHandler<PayloadRecentPathParams, XyoPayload[]> = async (req, res, next) => {
  const { archive, limit } = req.params
  const limitNumber = tryParseInt(limit) ?? 20
  assertEx(limitNumber > 0 && limitNumber <= 100, 'limit must be between 1 and 100')
  const payloads = await getPayloads(archive, limitNumber)
  res.json(payloads)
  next()
}

export const getArchivePayloadRecent = genericAsyncHandler(handler)
