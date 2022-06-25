import { asyncHandler, NoReqBody, NoReqQuery, tryParseInt } from '@xylabs/sdk-api-express-ecs'
import { assertEx } from '@xylabs/sdk-js'
import { XyoBoundWitness } from '@xyo-network/sdk-xyo-client-js'
import { RequestHandler } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'

import { getArchivistBoundWitnessesMongoSdk, scrubBoundWitnesses } from '../../../../lib'
import { ArchiveLocals, ArchivePathParams, SortDirection } from '../../../../model'

const defaultLimit = 10
const maxLimit = 100

export interface GetArchiveBlocksQueryParams extends NoReqQuery {
  limit?: string
  order?: SortDirection
  timestamp?: string
}

const getBoundWitnesses = (archive: string, timestamp?: number, limit = defaultLimit, sortOrder: SortDirection = 'asc'): Promise<XyoBoundWitness[] | null> => {
  const sdk = getArchivistBoundWitnessesMongoSdk(archive)
  if (timestamp) {
    return sortOrder === 'asc' ? sdk.findAfter(timestamp, limit) : sdk.findBefore(timestamp, limit)
  }
  // If no hash/timestamp was supplied, just return from the start/end of the archive
  return sortOrder === 'asc' ? sdk.findAfter(0, limit) : sdk.findBefore(Date.now(), limit)
}

const handler: RequestHandler<ArchivePathParams, Pick<XyoBoundWitness, keyof XyoBoundWitness>[], NoReqBody, GetArchiveBlocksQueryParams, ArchiveLocals> = async (
  req,
  res,
  next
) => {
  const { archive } = res.locals
  if (!archive) {
    next({ message: ReasonPhrases.NOT_FOUND, statusCode: StatusCodes.NOT_FOUND })
  }
  const { limit, order, timestamp } = req.query
  const limitNumber = tryParseInt(limit) ?? 10
  assertEx(limitNumber > 0 && limitNumber <= maxLimit, `limit must be between 1 and ${maxLimit}`)
  const timestampNumber = tryParseInt(timestamp)
  const parsedOrder = order?.toLowerCase?.() === 'asc' ? 'asc' : 'desc'
  const boundWitnesses = await getBoundWitnesses(archive.archive, timestampNumber, limitNumber, parsedOrder)
  if (boundWitnesses) {
    res.json(scrubBoundWitnesses(boundWitnesses))
  } else {
    next({ message: ReasonPhrases.NOT_FOUND, statusCode: StatusCodes.NOT_FOUND })
  }
}

export const getArchiveBlocks = asyncHandler(handler)
