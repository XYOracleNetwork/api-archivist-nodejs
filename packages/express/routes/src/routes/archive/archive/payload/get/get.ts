import { assertEx } from '@xylabs/assert'
import { asyncHandler, NoReqBody, tryParseInt } from '@xylabs/sdk-api-express-ecs'
import { exists } from '@xylabs/sdk-js'
import { ArchiveLocals, ArchivePathParams, XyoArchivePayloadFilterPredicate } from '@xyo-network/archivist-model'
import { XyoPayload, XyoPayloadWrapper } from '@xyo-network/payload'
import { RequestHandler } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'

import { GetArchivePayloadsQueryParams } from './GetArchivePayloadsQueryParams'

const maxLimit = 100

const handler: RequestHandler<ArchivePathParams, XyoPayload[], NoReqBody, GetArchivePayloadsQueryParams, ArchiveLocals> = async (req, res, next) => {
  const { archive } = res.locals
  if (!archive) {
    next({ message: ReasonPhrases.NOT_FOUND, statusCode: StatusCodes.NOT_FOUND })
  }
  const { limit, order, timestamp, schema } = req.query
  const { archivePayloadsArchivist } = req.app
  const limitNumber = tryParseInt(limit) ?? 10
  const timestampNumber = tryParseInt(timestamp)
  assertEx(limitNumber > 0 && limitNumber <= maxLimit, `limit must be between 1 and ${maxLimit}`)
  const parsedOrder = order?.toLowerCase?.() === 'asc' ? 'asc' : 'desc'
  const predicate: XyoArchivePayloadFilterPredicate<XyoPayload> = {
    archive: archive.archive,
    limit: limitNumber,
    order: parsedOrder,
    schema,
    timestamp: timestampNumber,
  }
  const payloads = await archivePayloadsArchivist.find(predicate)
  if (payloads) {
    res.json(payloads.filter(exists).map((payload) => new XyoPayloadWrapper(payload).body))
  } else {
    next({ message: ReasonPhrases.NOT_FOUND, statusCode: StatusCodes.NOT_FOUND })
  }
}

export const getArchivePayloads = asyncHandler(handler)
