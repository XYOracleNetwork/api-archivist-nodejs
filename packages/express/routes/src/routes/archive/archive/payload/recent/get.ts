import 'source-map-support/register'

import { assertEx } from '@xylabs/assert'
import { asyncHandler, tryParseInt } from '@xylabs/sdk-api-express-ecs'
import { exists } from '@xylabs/sdk-js'
import { XyoArchivePayloadFilterPredicate } from '@xyo-network/archivist-model'
import { XyoPayload } from '@xyo-network/payload'
import { RequestHandler } from 'express'

import { PayloadRecentPathParams } from './payloadRecentPathParams'

const handler: RequestHandler<PayloadRecentPathParams, XyoPayload[]> = async (req, res) => {
  const { archive, limit } = req.params
  const { archivePayloadsArchivist } = req.app
  const limitNumber = tryParseInt(limit) ?? 20
  assertEx(limitNumber > 0 && limitNumber <= 100, 'limit must be between 1 and 100')
  const predicate: XyoArchivePayloadFilterPredicate<XyoPayload> = {
    archive,
    limit: limitNumber,
    order: 'desc',
  }
  const payloads = await archivePayloadsArchivist.find(predicate)
  res.json(payloads.filter(exists))
}

export const getArchivePayloadRecent = asyncHandler(handler)
