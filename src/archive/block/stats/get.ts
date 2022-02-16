import 'source-map-support/register'

import { RequestHandler } from 'express'

import { genericAsyncHandler, getArchivistBoundWitnessesMongoSdk } from '../../../lib'
import { ArchivePathParams } from '../../archivePathParams'

export interface IGetArchiveBlockStatsResponse {
  count: number
}

const getCount = async (archive: string) => {
  const sdk = await getArchivistBoundWitnessesMongoSdk(archive)
  return await sdk.fetchCount()
}

const handler: RequestHandler<ArchivePathParams, IGetArchiveBlockStatsResponse> = async (req, res, next) => {
  const { archive } = req.params
  res.json({
    count: await getCount(archive),
  })
  next()
}

export const getArchiveBlockStats = genericAsyncHandler(handler)
