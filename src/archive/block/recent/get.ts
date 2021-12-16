import 'source-map-support/register'

import { assertEx } from '@xylabs/sdk-js'
import { NextFunction, Request, Response } from 'express'

import { getArchivistBoundWitnessesMongoSdk, tryParseInt } from '../../../lib'

const getBoundWitness = async (archive: string, limit: number) => {
  const sdk = await getArchivistBoundWitnessesMongoSdk(archive)
  return await sdk.findRecent(limit)
}

export const getArchiveBlockRecent = async (req: Request, res: Response, next: NextFunction) => {
  const { archive, limit } = req.params
  const limitNumber = tryParseInt(limit) ?? 50
  assertEx(limitNumber > 0 && limitNumber <= 100, 'limit must be between 1 and 100')
  const bw = await getBoundWitness(archive, limitNumber)
  res.json(bw?.map(({ _payloads, ...clean }) => clean))
  next()
}
