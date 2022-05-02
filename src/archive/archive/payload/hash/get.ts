import 'source-map-support/register'

import { asyncHandler } from '@xylabs/sdk-api-express-ecs'
import { XyoPayload } from '@xyo-network/sdk-xyo-client-js'
import { RequestHandler } from 'express'

import { getArchivistPayloadMongoSdk } from '../../../../lib'
import { PayloadHashPathParams } from '../payloadHashPathParams'

const getPayload = async (archive: string, hash: string) => {
  const sdk = getArchivistPayloadMongoSdk(archive)
  return await sdk.findByHash(hash)
}

const handler: RequestHandler<PayloadHashPathParams, XyoPayload[]> = async (req, res, next) => {
  const { archive, hash } = req.params

  res.json((await getPayload(archive, hash)) ?? [])
  next()
}

export const getArchivePayloadHash = asyncHandler(handler)
