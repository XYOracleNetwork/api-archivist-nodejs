import 'source-map-support/register'

import { assertEx } from '@xylabs/assert'
import { asyncHandler, tryParseInt } from '@xylabs/sdk-api-express-ecs'
import { XyoArchivistFindQuery, XyoArchivistFindQuerySchema } from '@xyo-network/archivist'
import { XyoArchivePayloadFilterPredicate } from '@xyo-network/archivist-model'
import { XyoPayload } from '@xyo-network/payload'
import { RequestHandler } from 'express'

import { PayloadRecentPathParams } from './payloadRecentPathParams'

const handler: RequestHandler<PayloadRecentPathParams, (XyoPayload | null)[]> = async (req, res) => {
  const { archive, limit } = req.params
  const { archivePayloadsArchivist: archivist } = req.app
  const limitNumber = tryParseInt(limit) ?? 20
  assertEx(limitNumber > 0 && limitNumber <= 100, 'limit must be between 1 and 100')
  const filter: XyoArchivePayloadFilterPredicate<XyoPayload> = {
    archive,
    limit: limitNumber,
    order: 'desc',
  }
  const query: XyoArchivistFindQuery = {
    filter,
    schema: XyoArchivistFindQuerySchema,
  }
  const result = await archivist.query(query)
  const payloads = result?.[1]
  res.json(payloads)
}

export const getArchivePayloadRecent = asyncHandler(handler)
