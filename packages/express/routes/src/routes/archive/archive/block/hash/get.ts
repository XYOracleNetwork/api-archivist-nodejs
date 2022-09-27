import 'source-map-support/register'

import { asyncHandler } from '@xylabs/sdk-api-express-ecs'
import { XyoArchivistGetQuery, XyoArchivistGetQuerySchema } from '@xyo-network/archivist'
import { scrubBoundWitnesses } from '@xyo-network/archivist-lib'
import { XyoBoundWitness } from '@xyo-network/boundwitness'
import { QueryBoundWitnessBuilder } from '@xyo-network/module'
import { PayloadWrapper } from '@xyo-network/payload'
import { RequestHandler } from 'express'

import { BlockHashPathParams } from './blockHashPathParams'

const handler: RequestHandler<BlockHashPathParams, XyoBoundWitness[]> = async (req, res) => {
  const { archive, hash } = req.params
  const { archiveBoundWitnessArchivistFactory } = req.app
  const query: XyoArchivistGetQuery = {
    hashes: [{ archive, hash }] as unknown as string[],
    schema: XyoArchivistGetQuerySchema,
  }
  const bw = new QueryBoundWitnessBuilder().query(PayloadWrapper.hash(query)).payload(query).build()
  const result = await archiveBoundWitnessArchivistFactory(archive).query(bw, query)
  const block = result?.[1]?.[0] as unknown as XyoBoundWitness
  res.json(scrubBoundWitnesses(block ? [block] : []))
}

export const getArchiveBlockHash = asyncHandler(handler)
