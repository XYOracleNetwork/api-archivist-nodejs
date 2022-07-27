import 'source-map-support/register'

import { asyncHandler } from '@xylabs/sdk-api-express-ecs'
import { getArchivistBoundWitnessesMongoSdk, getArchivistPayloadMongoSdk } from '@xyo-network/archivist-lib'
import { XyoPartialPayloadMeta } from '@xyo-network/sdk-xyo-client-js'
import { RequestHandler } from 'express'
import { StatusCodes } from 'http-status-codes'

import { BlockHashPathParams } from '../blockHashPathParams'

const getBoundWitness = async (archive: string, hash: string) => {
  const sdk = getArchivistBoundWitnessesMongoSdk(archive)
  return await sdk.findByHash(hash)
}

const getPayloads = async (archive: string, hashes: string[]) => {
  const sdk = getArchivistPayloadMongoSdk(archive)
  const map: Record<string, XyoPartialPayloadMeta[]> = {}
  const payloads = await sdk.findByHashes(hashes)
  payloads.forEach((value) => {
    if (value._hash) {
      map[value._hash] = map[value._hash] ? [...map[value._hash], value] : [value]
    }
  })
  return hashes.map((value) => map[value])
}

const handler: RequestHandler<BlockHashPathParams, XyoPartialPayloadMeta[][]> = async (req, res, next) => {
  const { archive, hash } = req.params
  const bw = await getBoundWitness(archive, hash)
  if (bw && bw.length > 0) {
    res.json(await getPayloads(archive, bw[0].payload_hashes))
  } else {
    next({ message: 'Block not found', statusCode: StatusCodes.NOT_FOUND })
  }
}

export const getArchiveBlockHashPayloads = asyncHandler(handler)
