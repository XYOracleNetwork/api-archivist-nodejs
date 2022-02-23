import { asyncHandler, NoReqBody, NoReqQuery, tryParseInt } from '@xylabs/sdk-api-express-ecs'
import { assertEx } from '@xylabs/sdk-js'
import { XyoBoundWitness } from '@xyo-network/sdk-xyo-client-js'
import { RequestHandler } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'

import { getArchivistBoundWitnessesMongoSdk, scrubBoundWitnesses } from '../../../../lib'
import { SortDirection } from '../../../../model'
import { ArchiveLocals } from '../../../archiveLocals'
import { ArchivePathParams } from '../../../archivePathParams'

const defaultLimit = 10
const maxLimit = 100

export interface GetArchiveBlocksQueryParams extends NoReqQuery {
  hash?: string
  limit?: string
  order?: SortDirection
  timestamp?: string
}

const getBoundWitnesses = async (
  archive: string,
  hash?: string,
  timestamp?: number,
  limit = defaultLimit,
  sortOrder: SortDirection = 'asc'
): Promise<XyoBoundWitness[] | null> => {
  const sdk = await getArchivistBoundWitnessesMongoSdk(archive)
  if (hash) {
    return sortOrder === 'asc' ? sdk.findAfterHash(hash, limit, timestamp) : sdk.findBeforeHash(hash, limit, timestamp)
  }
  if (timestamp) {
    return sortOrder === 'asc' ? sdk.findAfter(timestamp) : sdk.findBefore(timestamp)
  }
  // If no hash/timestamp was supplied, just return from the start/end of the archive
  return sortOrder === 'asc' ? sdk.findAfter(0, limit) : sdk.findBefore(Date.now(), limit)
}

const handler: RequestHandler<
  ArchivePathParams,
  Pick<XyoBoundWitness, string>[],
  NoReqBody,
  GetArchiveBlocksQueryParams,
  ArchiveLocals
> = async (req, res, next) => {
  const { archive } = res.locals
  if (!archive) {
    next({ message: ReasonPhrases.NOT_FOUND, statusCode: StatusCodes.NOT_FOUND })
  }
  const { hash, limit, order, timestamp } = req.query
  if (!hash) {
    next({ message: ReasonPhrases.BAD_REQUEST, statusCode: StatusCodes.BAD_REQUEST })
  }
  const limitNumber = tryParseInt(limit) ?? 10
  const timestampNumber = tryParseInt(timestamp)
  assertEx(limitNumber > 0 && limitNumber <= maxLimit, `limit must be between 1 and ${maxLimit}`)
  const parsedOrder = order?.toLowerCase?.() === 'asc' ? 'asc' : 'desc'
  const boundWitnesses = await getBoundWitnesses(archive.archive, hash, timestampNumber, limitNumber, parsedOrder)
  if (boundWitnesses) {
    res.json(scrubBoundWitnesses(boundWitnesses))
    next()
  } else {
    next({ message: ReasonPhrases.NOT_FOUND, statusCode: StatusCodes.NOT_FOUND })
  }
}

export const getArchiveBlocks = asyncHandler(handler)
