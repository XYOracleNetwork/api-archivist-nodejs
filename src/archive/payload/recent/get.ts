import 'source-map-support/register'

import { tryParseInt } from '@xylabs/sdk-api-express-ecs'
import { assertEx } from '@xylabs/sdk-js'
import { NextFunction, Request, Response } from 'express'

import { getArchivistPayloadMongoSdk } from '../../../lib'

const getPayloads = async (archive: string, limit: number) => {
  const sdk = await getArchivistPayloadMongoSdk(archive)
  return await sdk.findRecent(limit)
}

export const getArchivePayloadRecent = async (req: Request, res: Response, next: NextFunction) => {
  const { archive, limit } = req.params
  const limitNumber = tryParseInt(limit) ?? 20
  assertEx(limitNumber > 0 && limitNumber <= 100, 'limit must be between 1 and 100')
  const payloads = await getPayloads(archive, limitNumber)
  res.json(payloads)
  next()
}
