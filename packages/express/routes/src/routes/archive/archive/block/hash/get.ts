import 'source-map-support/register'

import { asyncHandler } from '@xylabs/sdk-api-express-ecs'
import { getArchivistBoundWitnessesMongoSdk, scrubBoundWitnesses } from '@xyo-network/archivist-lib'
import { XyoBoundWitness } from '@xyo-network/sdk-xyo-client-js'
import { RequestHandler } from 'express'

import { BlockHashPathParams } from './blockHashPathParams'

const getBoundWitness = async (archive: string, hash: string) => {
  const sdk = getArchivistBoundWitnessesMongoSdk(archive)
  return await sdk.findByHash(hash)
}

const handler: RequestHandler<BlockHashPathParams, XyoBoundWitness[]> = async (req, res) => {
  const { archive, hash } = req.params
  res.json(scrubBoundWitnesses(await getBoundWitness(archive, hash)) ?? [])
}

export const getArchiveBlockHash = asyncHandler(handler)
