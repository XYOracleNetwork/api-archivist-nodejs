import 'source-map-support/register'

import { asyncHandler } from '@xylabs/sdk-api-express-ecs'
import { RequestHandler } from 'express'

import { getArchivistPayloadMongoSdk } from '../../../../lib'
import { ArchivePathParams } from '../../../../model'

const getCount = async (archive: string) => {
  const sdk = await getArchivistPayloadMongoSdk(archive)
  return await sdk.fetchCount()
}

export interface ArchivePayloadStats {
  count: number
}

const handler: RequestHandler<ArchivePathParams, ArchivePayloadStats[]> = async (req, res, next) => {
  const { archive } = req.params
  res.json([{ count: await getCount(archive) }])
  next()
}

export const getArchivePayloadStats = asyncHandler(handler)
