import { asyncHandler, NoReqBody, NoReqQuery, tryParseInt } from '@xylabs/sdk-api-express-ecs'
import { assertEx } from '@xylabs/sdk-js'
import { XyoPayload } from '@xyo-network/sdk-xyo-client-js'
import { RequestHandler } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'

import { getArchivistPayloadMongoSdk } from '../../../../lib'
import { ArchiveLocals, ArchivePathParams, SortDirection } from '../../../../model'

const defaultLimit = 10
const maxLimit = 100

export interface GetArchivePayloadsQueryParams extends NoReqQuery {
  limit?: string
  order?: SortDirection
  schema?: string
  timestamp?: string
}

const getPayloads = (archive: string, timestamp?: number, limit = defaultLimit, sortOrder: SortDirection = 'desc', schema?: string): Promise<XyoPayload[] | null> => {
  const sdk = getArchivistPayloadMongoSdk(archive)
  // If no hash/timestamp was supplied, just return from the start/end of the archive
  if (!timestamp) timestamp = sortOrder === 'desc' ? Date.now() : 0
  return sdk.findSorted(timestamp, limit, sortOrder, schema)
}

const handler: RequestHandler<ArchivePathParams, XyoPayload[], NoReqBody, GetArchivePayloadsQueryParams, ArchiveLocals> = async (req, res, next) => {
  const { archive } = res.locals
  if (!archive) {
    next({ message: ReasonPhrases.NOT_FOUND, statusCode: StatusCodes.NOT_FOUND })
  }
  const { limit, order, timestamp, schema } = req.query
  const limitNumber = tryParseInt(limit) ?? 10
  const timestampNumber = tryParseInt(timestamp)
  assertEx(limitNumber > 0 && limitNumber <= maxLimit, `limit must be between 1 and ${maxLimit}`)
  const parsedOrder = order?.toLowerCase?.() === 'asc' ? 'asc' : 'desc'
  const payloads = await getPayloads(archive.archive, timestampNumber, limitNumber, parsedOrder, schema)
  if (payloads) {
    res.json(payloads)
    next()
  } else {
    next({ message: ReasonPhrases.NOT_FOUND, statusCode: StatusCodes.NOT_FOUND })
  }
}

export const getArchivePayloads = asyncHandler(handler)
