import 'source-map-support/register'

import { RequestHandler } from 'express'

import { genericAsyncHandler, getArchivistBoundWitnessesMongoSdk } from '../../../../lib'
import { ArchivePathParams } from '../../../archivePathParams'

export interface GetArchiveBlockStatsResponse {
  count: number
}

const getCount = async (archive: string) => {
  const sdk = await getArchivistBoundWitnessesMongoSdk(archive)
  return await sdk.fetchCount()
}

const handler: RequestHandler<ArchivePathParams, GetArchiveBlockStatsResponse> = async (req, res, next) => {
  const { archive } = req.params
  res.json({
    count: await getCount(archive),
  })
  next()
}

export const getArchiveBlockStats = genericAsyncHandler(handler)
