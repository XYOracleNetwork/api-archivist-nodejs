import 'source-map-support/register'

import { assertEx } from '@xylabs/assert'
import { asyncHandler, tryParseInt } from '@xylabs/sdk-api-express-ecs'
import { exists } from '@xylabs/sdk-js'
import { ArchiveBoundWitnessesArchivist, XyoArchiveBoundWitnessFilterPredicate } from '@xyo-network/archivist-model'
import { RequestHandler } from 'express'

import { BlockRecentPathParams } from './BlockRecentPathParams'

const getBoundWitnesses = (archivist: ArchiveBoundWitnessesArchivist, archive: string, limit: number) => {
  const query: XyoArchiveBoundWitnessFilterPredicate = { archive, limit }
  return archivist.find(query)
}

const handler: RequestHandler<BlockRecentPathParams> = async (req, res) => {
  const { archive, limit } = req.params
  const { archiveBoundWitnessesArchivist: archivist } = req.app
  const limitNumber = tryParseInt(limit) ?? 20
  assertEx(limitNumber > 0 && limitNumber <= 100, 'limit must be between 1 and 100')
  const boundWitnesses = await getBoundWitnesses(archivist, archive, limitNumber)
  res.json(boundWitnesses.filter(exists).map(({ _payloads, ...clean }) => clean))
}

export const getArchiveBlockRecent = asyncHandler(handler)
