import 'source-map-support/register'

import { asyncHandler } from '@xylabs/sdk-api-express-ecs'
import { XyoPayload } from '@xyo-network/sdk-xyo-client-js'
import { RequestHandler } from 'express'

import { getArchivistPayloadMongoSdk } from '../../../../lib'
import { PayloadHashPathParams } from '../payloadHashPathParams'

const getPayload = (archive: string, hash: string): Promise<XyoPayload[]> => {
  const sdk = getArchivistPayloadMongoSdk(archive)
  return sdk.findByHash(hash)
}

const handler: RequestHandler<PayloadHashPathParams, XyoPayload[]> = async (req, res, next) => {
  const { archive, hash } = req.params
  const payload = (await getPayload(archive, hash)) ?? []
  res.json(payload)
  next()
}

export const getArchivePayloadHash = asyncHandler(handler)
