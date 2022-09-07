import 'source-map-support/register'

import { asyncHandler } from '@xylabs/sdk-api-express-ecs'
import { exists } from '@xylabs/sdk-js'
import { scrubBoundWitnesses } from '@xyo-network/archivist-lib'
import { XyoBoundWitness } from '@xyo-network/sdk-xyo-client-js'
import { RequestHandler } from 'express'

import { BlockHashPathParams } from './blockHashPathParams'

const handler: RequestHandler<BlockHashPathParams, XyoBoundWitness[]> = async (req, res) => {
  const { archive, hash } = req.params
  const { archiveBoundWitnessesArchivist } = req.app
  const result = await archiveBoundWitnessesArchivist.get([{ archive, hash }])
  res.json(scrubBoundWitnesses(result.filter(exists)) ?? [])
}

export const getArchiveBlockHash = asyncHandler(handler)
