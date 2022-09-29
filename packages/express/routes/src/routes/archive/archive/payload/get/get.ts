import { assertEx } from '@xylabs/assert'
import { asyncHandler, NoReqBody, tryParseInt } from '@xylabs/sdk-api-express-ecs'
import { XyoArchivistWrapper } from '@xyo-network/archivist'
import { ArchiveLocals, ArchivePathParams, XyoPayloadFilterPredicate } from '@xyo-network/archivist-model'
import { XyoPayload } from '@xyo-network/payload'
import { RequestHandler } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'

import { GetArchivePayloadsQueryParams } from './GetArchivePayloadsQueryParams'

const maxLimit = 100

const handler: RequestHandler<ArchivePathParams, (XyoPayload | null)[], NoReqBody, GetArchivePayloadsQueryParams, ArchiveLocals> = async (
  req,
  res,
  next,
) => {
  const { archive } = res.locals
  if (!archive) {
    next({ message: ReasonPhrases.NOT_FOUND, statusCode: StatusCodes.NOT_FOUND })
  }
  const { limit, order, timestamp, schema } = req.query
  const { archivePayloadsArchivistFactory } = req.app
  const limitNumber = tryParseInt(limit) ?? 10
  const timestampNumber = tryParseInt(timestamp)
  assertEx(limitNumber > 0 && limitNumber <= maxLimit, `limit must be between 1 and ${maxLimit}`)
  const parsedOrder = order?.toLowerCase?.() === 'asc' ? 'asc' : 'desc'
  const filter: XyoPayloadFilterPredicate<XyoPayload> = {
    limit: limitNumber,
    order: parsedOrder,
    schema,
    timestamp: timestampNumber,
  }

  const wrapper = new XyoArchivistWrapper(archivePayloadsArchivistFactory(archive.archive))
  const payloads = await wrapper.find(filter)

  if (payloads) {
    res.json(payloads)
  } else {
    next({ message: ReasonPhrases.NOT_FOUND, statusCode: StatusCodes.NOT_FOUND })
  }
}

export const getArchivePayloads = asyncHandler(handler)
