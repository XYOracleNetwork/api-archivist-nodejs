import 'source-map-support/register'

import { asyncHandler, tryParseInt } from '@xylabs/sdk-api-express-ecs'
import { assertEx } from '@xylabs/sdk-js'
import { getArchivistPayloadMongoSdk } from '@xyo-network/archivist-lib'
import { XyoPayload } from '@xyo-network/sdk-xyo-client-js'
import { RequestHandler } from 'express'
import { WithId } from 'mongodb'

import { PayloadChainPathParams } from './payloadChainPathParams'

const getPayloads = async (archive: string, hash: string, payloads: WithId<XyoPayload>[], limit: number) => {
  const sdk = getArchivistPayloadMongoSdk(archive)
  const payload = (await sdk.findByHash(hash)).pop()
  if (payload) {
    payloads.push(payload)
    if (payload.previousHash && limit > payloads.length) {
      await getPayloads(archive, payload.previousHash, payloads, limit)
    }
  }
}

const handler: RequestHandler<PayloadChainPathParams, XyoPayload[]> = async (req, res) => {
  const { archive, limit, hash } = req.params
  const limitNumber = tryParseInt(limit) ?? 20
  assertEx(limitNumber > 0 && limitNumber <= 100, 'limit must be between 1 and 100')
  const payloads: WithId<XyoPayload>[] = []
  await getPayloads(archive, hash, payloads, limitNumber)
  res.json(payloads)
}

export const getArchivePayloadChain = asyncHandler(handler)
