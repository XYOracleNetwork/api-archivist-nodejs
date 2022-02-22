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
  hash: string
  limit?: string
  order?: SortDirection
}

// TODO: Move to SDK lib
const getPayloads = async (archive: string, hash: string, limit = defaultLimit, sortOrder: SortDirection = 'asc') => {
  const sdk = await getArchivistPayloadMongoSdk(archive)
  const payload = await sdk.findOne({ _hash: hash })
  if (!payload || !payload._timestamp) {
    return null
  }
  const _timestampPredicate = sortOrder === 'asc' ? { $gte: payload._timestamp } : { $lte: payload._timestamp }
  return await (
    await sdk.useCollection((col) =>
      col.find({ _archive: archive, _timestamp: _timestampPredicate }).sort({ _timestamp: sortOrder }).limit(limit)
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
  const { hash, limit, order: orderBy } = req.query
  if (!hash) {
    next({ message: ReasonPhrases.BAD_REQUEST, statusCode: StatusCodes.BAD_REQUEST })
  }
  const limitNumber = tryParseInt(limit) ?? 10
  assertEx(limitNumber > 0 && limitNumber <= maxLimit, `limit must be between 1 and ${maxLimit}`)
  const parsedOrderBy = orderBy?.toLowerCase?.() === 'asc' ? 'asc' : 'desc'
  const payloads = await getPayloads(archive.archive, hash, limitNumber, parsedOrderBy)
  if (payloads) {
    res.json(payloads)
    next()
  } else {
    next({ message: ReasonPhrases.NOT_FOUND, statusCode: StatusCodes.NOT_FOUND })
  }
}

export const getArchivePayloads = asyncHandler(handler)
