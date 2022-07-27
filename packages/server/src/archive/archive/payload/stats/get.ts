import 'source-map-support/register'

import { asyncHandler } from '@xylabs/sdk-api-express-ecs'
import { getArchivistPayloadMongoSdk } from '@xyo-network/archivist-lib'
import { ArchivePathParams } from '@xyo-network/archivist-model'
import { RequestHandler } from 'express'

const getCount = async (archive: string) => {
  const sdk = getArchivistPayloadMongoSdk(archive)
  return await sdk.fetchCount()
}

export interface ArchivePayloadStats {
  count: number
}

const handler: RequestHandler<ArchivePathParams, ArchivePayloadStats> = async (req, res) => {
  const { archive } = req.params
  res.json({ count: await getCount(archive) })
}

export const getArchivePayloadStats = asyncHandler(handler)
