import 'source-map-support/register'

import { assertEx } from '@xylabs/assert'
import { asyncHandler, tryParseInt } from '@xylabs/sdk-api-express-ecs'
import { XyoArchivistWrapper } from '@xyo-network/archivist'
import { ArchiveBoundWitnessArchivist, XyoBoundWitnessFilterPredicate } from '@xyo-network/archivist-model'
import { XyoBoundWitness } from '@xyo-network/boundwitness'
import { RequestHandler } from 'express'

import { BlockRecentPathParams } from './BlockRecentPathParams'

const getBoundWitnesses = async (archivist: ArchiveBoundWitnessArchivist, limit: number) => {
  const filter: XyoBoundWitnessFilterPredicate = { limit }

  const wrapper = new XyoArchivistWrapper(archivist)
  return await wrapper.find(filter)
}

const handler: RequestHandler<BlockRecentPathParams, (XyoBoundWitness | null)[]> = async (req, res) => {
  const { archive, limit } = req.params
  const { archiveBoundWitnessArchivistFactory } = req.app
  const limitNumber = tryParseInt(limit) ?? 20
  assertEx(limitNumber > 0 && limitNumber <= 100, 'limit must be between 1 and 100')
  const boundWitnesses = (await getBoundWitnesses(archiveBoundWitnessArchivistFactory(archive), limitNumber)) as (XyoBoundWitness | null)[]
  res.json(boundWitnesses)
}

export const getArchiveBlockRecent = asyncHandler(handler)
