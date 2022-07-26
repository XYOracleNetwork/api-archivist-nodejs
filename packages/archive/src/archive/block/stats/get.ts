import 'source-map-support/register'

import { asyncHandler } from '@xylabs/sdk-api-express-ecs'
import { getArchivistBoundWitnessesMongoSdk } from '@xyo-network/archivist-lib'
import { ArchivePathParams } from '@xyo-network/archivist-model'
import { RequestHandler } from 'express'

export interface GetArchiveBlockStats {
  count: number
}

const getCount = async (archive: string) => {
  const sdk = getArchivistBoundWitnessesMongoSdk(archive)
  return await sdk.fetchCount()
}

const handler: RequestHandler<ArchivePathParams, GetArchiveBlockStats> = async (req, res) => {
  const { archive } = req.params
  res.json({
    count: await getCount(archive),
  })
}

export const getArchiveBlockStats = asyncHandler(handler)
