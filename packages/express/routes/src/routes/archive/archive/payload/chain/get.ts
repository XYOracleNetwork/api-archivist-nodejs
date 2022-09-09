import 'source-map-support/register'

import { assertEx } from '@xylabs/assert'
import { asyncHandler, tryParseInt } from '@xylabs/sdk-api-express-ecs'
import { ArchivePayloadsArchivist } from '@xyo-network/archivist-model'
import { XyoPayload } from '@xyo-network/payload'
import { RequestHandler } from 'express'

import { PayloadChainPathParams } from './payloadChainPathParams'

const getPayloads = async (archivist: ArchivePayloadsArchivist, archive: string, hash: string, payloads: XyoPayload[], limit: number) => {
  const payload = (await archivist.get([{ archive, hash }])).pop()
  if (payload) {
    payloads.push(payload)
    if (payload.previousHash && limit > payloads.length) {
      await getPayloads(archivist, archive, payload.previousHash, payloads, limit)
    }
  }
}

const handler: RequestHandler<PayloadChainPathParams, XyoPayload[]> = async (req, res) => {
  const { archive, limit, hash } = req.params
  const { archivePayloadsArchivist: archivist } = req.app
  const limitNumber = tryParseInt(limit) ?? 20
  assertEx(limitNumber > 0 && limitNumber <= 100, 'limit must be between 1 and 100')
  const payloads: XyoPayload[] = []
  await getPayloads(archivist, archive, hash, payloads, limitNumber)
  res.json(payloads)
}

export const getArchivePayloadChain = asyncHandler(handler)
