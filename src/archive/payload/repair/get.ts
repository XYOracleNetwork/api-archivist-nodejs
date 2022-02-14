import 'source-map-support/register'

import { XyoPayload, XyoPayloadWrapper } from '@xyo-network/sdk-xyo-client-js'
import { NextFunction, Request, Response } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'

import { getArchivistPayloadMongoSdk } from '../../../lib'

const getPayload = async (archive: string, hash: string) => {
  const sdk = await getArchivistPayloadMongoSdk(archive)
  return await sdk.findByHash(hash)
}

const updatePayload = async (archive: string, hash: string, payload: XyoPayload) => {
  const sdk = await getArchivistPayloadMongoSdk(archive)
  const wrapper = new XyoPayloadWrapper(payload)
  return await sdk.updateByHash(hash, { ...payload, _hash: wrapper.sortedHash() })
}

export interface IRepairHashResponse {
  acknowledged: boolean
  matchedCount: number
  modifiedCount: number
  upsertedCount: number
  upsertedId: null | string
}

export const getArchivePayloadRepair = async (req: Request, res: Response, next: NextFunction) => {
  const { archive, hash } = req.params
  const payloads = await getPayload(archive, hash)
  const payload = payloads.length > 0 ? payloads[0] : undefined
  if (payload) {
    res.json(await updatePayload(archive, hash, payload))
    next()
  } else {
    next({ message: ReasonPhrases.NOT_FOUND, statusCode: StatusCodes.NOT_FOUND })
  }
}
