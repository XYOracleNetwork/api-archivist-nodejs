import 'source-map-support/register'

import { asyncHandler } from '@xylabs/sdk-api-express-ecs'
import { getArchivistBoundWitnessesMongoSdk, scrubBoundWitnesses } from '@xyo-network/archivist-lib'
import { RequestHandler } from 'express'

import { BlockHashPathParams } from './blockHashPathParams'

const getBoundWitness = async (archive: string, hash: string) => {
  const sdk = getArchivistBoundWitnessesMongoSdk(archive)
  return await sdk.findByHash(hash)
}

export type GetArchiveBlockHashResponse = {
  _archive?: string
  _hash?: string
  _timestamp?: number
  _user_agent?: string | null
}[]

const handler: RequestHandler<BlockHashPathParams, GetArchiveBlockHashResponse> = async (req, res) => {
  const { archive, hash } = req.params
  res.json(scrubBoundWitnesses(await getBoundWitness(archive, hash)) ?? [])
}

export const getArchiveBlockHash = asyncHandler(handler)
