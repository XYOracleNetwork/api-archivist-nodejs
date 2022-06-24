import 'source-map-support/register'

import { asyncHandler } from '@xylabs/sdk-api-express-ecs'
import { XyoPayload, XyoPayloadWrapper } from '@xyo-network/sdk-xyo-client-js'
import { RequestHandler } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import { UpdateResult } from 'mongodb'

import { getArchivistPayloadMongoSdk } from '../../../../lib'
import { PayloadHashPathParams } from '../payloadHashPathParams'

const getPayload = async (archive: string, hash: string) => {
  const sdk = getArchivistPayloadMongoSdk(archive)
  return await sdk.findByHash(hash)
}

const updatePayload = async (archive: string, hash: string, payload: XyoPayload) => {
  const sdk = getArchivistPayloadMongoSdk(archive)
  const wrapper = new XyoPayloadWrapper(payload)
  return await sdk.updateByHash(hash, { ...payload, _hash: wrapper.hash })
}

export interface PayloadRepairHashResponse {
  acknowledged: boolean
  matchedCount: number
  modifiedCount: number
  upsertedCount: number
  // upsertedId: null | string
}

const handler: RequestHandler<PayloadHashPathParams, PayloadRepairHashResponse> = async (req, res, next) => {
  const { archive, hash } = req.params
  const payloads = await getPayload(archive, hash)
  const payload = payloads.length > 0 ? payloads[0] : undefined
  if (payload) {
    const result: UpdateResult = (await updatePayload(archive, hash, payload)) as UpdateResult
    res.json(result)
  } else {
    next({ message: ReasonPhrases.NOT_FOUND, statusCode: StatusCodes.NOT_FOUND })
  }
}

export const getArchivePayloadRepair = asyncHandler(handler)
