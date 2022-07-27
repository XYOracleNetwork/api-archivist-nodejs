import 'source-map-support/register'

import { asyncHandler, tryParseInt } from '@xylabs/sdk-api-express-ecs'
import { assertEx } from '@xylabs/sdk-js'
import { getArchivistBoundWitnessesMongoSdk } from '@xyo-network/archivist-lib'
import { RequestHandler } from 'express'

import { BlockRecentPathParams } from './BlockRecentPathParams'

const getBoundWitness = async (archive: string, limit: number) => {
  const sdk = getArchivistBoundWitnessesMongoSdk(archive)
  return await sdk.findRecent(limit)
}

const handler: RequestHandler<BlockRecentPathParams> = async (req, res) => {
  const { archive, limit } = req.params
  const limitNumber = tryParseInt(limit) ?? 20
  assertEx(limitNumber > 0 && limitNumber <= 100, 'limit must be between 1 and 100')
  const bw = await getBoundWitness(archive, limitNumber)
  res.json(bw?.map(({ _payloads, ...clean }) => clean))
}

export const getArchiveBlockRecent = asyncHandler(handler)
