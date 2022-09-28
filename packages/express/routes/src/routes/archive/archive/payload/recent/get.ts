import 'source-map-support/register'

import { assertEx } from '@xylabs/assert'
import { asyncHandler, tryParseInt } from '@xylabs/sdk-api-express-ecs'
import { XyoArchivistWrapper } from '@xyo-network/archivist'
import { XyoPayloadFilterPredicate } from '@xyo-network/archivist-model'
import { XyoPayload } from '@xyo-network/payload'
import { RequestHandler } from 'express'

import { PayloadRecentPathParams } from './payloadRecentPathParams'

const handler: RequestHandler<PayloadRecentPathParams, (XyoPayload | null)[]> = async (req, res) => {
  const { archive, limit } = req.params
  const { archivePayloadsArchivistFactory } = req.app
  const limitNumber = tryParseInt(limit) ?? 20
  assertEx(limitNumber > 0 && limitNumber <= 100, 'limit must be between 1 and 100')
  const filter: XyoPayloadFilterPredicate<XyoPayload> = {
    limit: limitNumber,
    order: 'desc',
  }

  const wrapper = new XyoArchivistWrapper(archivePayloadsArchivistFactory(archive))
  const payloads = await wrapper.find(filter)

  res.json(payloads)
}

export const getArchivePayloadRecent = asyncHandler(handler)
