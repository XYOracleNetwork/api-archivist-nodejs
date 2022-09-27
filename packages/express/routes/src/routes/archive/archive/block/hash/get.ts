import 'source-map-support/register'

import { asyncHandler } from '@xylabs/sdk-api-express-ecs'
import { XyoArchivistGetQuery, XyoArchivistGetQuerySchema } from '@xyo-network/archivist'
import { scrubBoundWitnesses } from '@xyo-network/archivist-lib'
import { BoundWitnessBuilder, XyoBoundWitness } from '@xyo-network/boundwitness'
import { RequestHandler } from 'express'

import { BlockHashPathParams } from './blockHashPathParams'

const handler: RequestHandler<BlockHashPathParams, XyoBoundWitness[]> = async (req, res) => {
  const { archive, hash } = req.params
  const { archiveBoundWitnessArchivistFactory } = req.app
  const query: XyoArchivistGetQuery = {
    hashes: [{ archive, hash }] as unknown as string[],
    schema: XyoArchivistGetQuerySchema,
  }
  const bw = new BoundWitnessBuilder().payload(query).build()
  const archivist = archiveBoundWitnessArchivistFactory(archive)
  const result = await archivist.query(bw, query)
  const block = result?.[1]?.[0] as unknown as XyoBoundWitness
  res.json(scrubBoundWitnesses(block ? [block] : []))
}

export const getArchiveBlockHash = asyncHandler(handler)
