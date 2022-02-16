import 'source-map-support/register'

import { RequestHandler } from 'express'

import { genericAsyncHandler, getArchivistPayloadMongoSdk } from '../../../../lib'
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

export const getArchivePayloadStats = genericAsyncHandler(handler)
