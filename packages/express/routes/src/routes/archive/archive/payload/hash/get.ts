import 'source-map-support/register'

import { asyncHandler } from '@xylabs/sdk-api-express-ecs'
import { exists } from '@xylabs/sdk-js'
import { XyoPayload, XyoPayloadWrapper } from '@xyo-network/sdk-xyo-client-js'
import { RequestHandler } from 'express'

import { PayloadHashPathParams } from '../payloadHashPathParams'

const handler: RequestHandler<PayloadHashPathParams, XyoPayload[]> = async (req, res) => {
  const { archive, hash } = req.params
  const { archivePayloadsArchivist } = req.app
  const payloads = (await archivePayloadsArchivist.get([{ archive, hash }])) ?? []
  res.json(payloads.filter(exists).map((payload) => new XyoPayloadWrapper(payload).body))
}

export const getArchivePayloadHash = asyncHandler(handler)
