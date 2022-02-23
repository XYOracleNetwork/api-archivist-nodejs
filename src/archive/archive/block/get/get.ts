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

// TODO: Move to SDK lib
const getBoundWitnesses = async (
  archive: string,
  hash?: string,
  timestamp?: number,
  limit = defaultLimit,
  sortOrder: SortDirection = 'asc'
): Promise<XyoBoundWitness[] | null> => {
  const sdk = await getArchivistBoundWitnessesMongoSdk(archive)
  // If no hash/timestamp was supplied, just return from the start/end of the archive
  if (!hash && !timestamp) {
    return sortOrder === 'asc' ? sdk.findAfter(0, limit) : sdk.findBefore(Date.now(), limit)
  }
  // If a filter was supplied, find that block
  const findOneFilter: { _hash?: string; _timestamp?: number } = {}
  if (hash) findOneFilter._hash = hash
  if (timestamp) findOneFilter._timestamp = timestamp
  const boundWitnesses = await sdk.findOne(findOneFilter)
  if (!boundWitnesses) {
    return null
  }

  // Find all blocks starting from that block
  const _idPredicate = sortOrder === 'asc' ? { $gte: boundWitnesses._id } : { $lte: boundWitnesses._id }
  const _timestampPredicate =
    sortOrder === 'asc' ? { $gte: boundWitnesses._timestamp } : { $lte: boundWitnesses._timestamp }
  return await (
    await sdk.useCollection((col) =>
      col
        // Order of keys really matters here since we're relying on the archive/timestamp
        // index so we disable eslint from sorting them alphabetically
        // eslint-disable-next-line sort-keys-fix/sort-keys-fix
        .find({ _archive: archive, _timestamp: _timestampPredicate, _id: _idPredicate })
        .sort({ _timestamp: sortOrder })
        .limit(limit)
    )
  ).toArray()
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
