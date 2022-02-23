import { asyncHandler, NoReqBody, NoReqQuery, tryParseInt } from '@xylabs/sdk-api-express-ecs'
import { assertEx } from '@xylabs/sdk-js'
import { XyoPayload } from '@xyo-network/sdk-xyo-client-js'
import { RequestHandler } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'

import { getArchivistPayloadMongoSdk } from '../../../../lib'
import { SortDirection } from '../../../../model'
import { ArchiveLocals } from '../../../archiveLocals'
import { ArchivePathParams } from '../../../archivePathParams'

const defaultLimit = 10
const maxLimit = 100

export interface GetArchivePayloadsQueryParams extends NoReqQuery {
  hash?: string
  limit?: string
  order?: SortDirection
  timestamp?: string
}

// TODO: Move to SDK lib
const getPayloads = async (
  archive: string,
  hash?: string,
  timestamp?: number,
  limit = defaultLimit,
  sortOrder: SortDirection = 'asc'
) => {
  const sdk = await getArchivistPayloadMongoSdk(archive)
  // If no hash/timestamp was supplied, just return from the start/end of the archive
  if (!hash && !timestamp) {
    throw new Error('Not implemented')
    // TODO: Implement these methods in the sdk
    // return sortOrder === 'asc' ? sdk.findAfter(0, limit) : sdk.findBefore(Date.now(), limit)
  }
  // If a filter was supplied, find that block
  const findOneFilter: { _hash?: string; _timestamp?: number } = {}
  if (hash) findOneFilter._hash = hash
  if (timestamp) findOneFilter._timestamp = timestamp
  const payloads = await sdk.findOne(findOneFilter)
  if (!payloads) {
    return null
  }

  // Find all blocks starting from that block
  const _idPredicate = sortOrder === 'asc' ? { $gte: payloads._id } : { $lte: payloads._id }
  const _timestampPredicate = sortOrder === 'asc' ? { $gte: payloads._timestamp } : { $lte: payloads._timestamp }
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
  XyoPayload[],
  NoReqBody,
  GetArchivePayloadsQueryParams,
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
  const payloads = await getPayloads(archive.archive, hash, timestampNumber, limitNumber, parsedOrder)
  if (payloads) {
    res.json(payloads)
    next()
  } else {
    next({ message: ReasonPhrases.NOT_FOUND, statusCode: StatusCodes.NOT_FOUND })
  }
}

export const getArchivePayloads = asyncHandler(handler)
