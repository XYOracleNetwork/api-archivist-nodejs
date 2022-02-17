import 'source-map-support/register'

import { asyncHandler } from '@xylabs/sdk-api-express-ecs'
import { RequestHandler } from 'express'

import { getArchivistPayloadMongoSdk } from '../../../../lib'
import { ArchivePathParams } from '../../../archivePathParams'

const getCount = async (archive: string) => {
  const sdk = await getArchivistPayloadMongoSdk(archive)
  return await sdk.fetchCount()
}

export interface ArchivePayloadStatsResponse {
  count: number
}

const handler: RequestHandler<ArchivePathParams, ArchivePayloadStatsResponse> = async (req, res, next) => {
  const { archive } = req.params
  res.json({ count: await getCount(archive) })
  next()
}

export const getArchivePayloadStats = asyncHandler(handler)
