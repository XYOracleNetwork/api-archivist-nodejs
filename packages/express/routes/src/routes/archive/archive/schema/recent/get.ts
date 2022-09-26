import 'source-map-support/register'

import { assertEx } from '@xylabs/assert'
import { asyncHandler, tryParseInt } from '@xylabs/sdk-api-express-ecs'
import { XyoArchivistFindQuery, XyoArchivistFindQuerySchema } from '@xyo-network/archivist'
import { ArchivePayloadsArchivist, XyoArchivePayloadFilterPredicate } from '@xyo-network/archivist-model'
import { QueryBoundWitnessBuilder } from '@xyo-network/module'
import { RequestHandler } from 'express'

import { ArchiveSchemaRecentPathParams } from './ArchiveSchemaRecentPathParams'

const getRecentSchemasForArchive = (archivist: ArchivePayloadsArchivist, archive: string, limit: number) => {
  const order = 'desc'
  const schema = 'network.xyo.schema'
  const filter: XyoArchivePayloadFilterPredicate = { archive, limit, order, schema }
  const query: XyoArchivistFindQuery = {
    filter,
    schema: XyoArchivistFindQuerySchema,
  }
  const bw = new QueryBoundWitnessBuilder().payload(query).build()
  return archivist.query(bw, [query])
}

const handler: RequestHandler<ArchiveSchemaRecentPathParams> = async (req, res) => {
  const { archive, limit } = req.params
  const { archivePayloadsArchivist: archivist } = req.app
  const limitNumber = tryParseInt(limit) ?? 20
  assertEx(limitNumber > 0 && limitNumber <= 100, 'limit must be between 1 and 100')
  const schemas = (await getRecentSchemasForArchive(archivist, archive, limitNumber))?.[1] || []
  res.json(schemas)
}

export const getArchiveSchemaRecent = asyncHandler(handler)
