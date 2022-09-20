import 'source-map-support/register'

import { assertEx } from '@xylabs/assert'
import { asyncHandler, tryParseInt } from '@xylabs/sdk-api-express-ecs'
import { XyoArchivistFindQuery, XyoArchivistFindQuerySchema } from '@xyo-network/archivist'
import { ArchivePayloadsArchivist, XyoArchivePayloadFilterPredicate } from '@xyo-network/archivist-model'
import { RequestHandler } from 'express'

import { ArchiveSchemaPayloadsRecentPathParams } from './ArchiveSchemaPayloadsRecentPathParams'

const getRecentPayloadsOfSchemaForArchive = (archivist: ArchivePayloadsArchivist, archive: string, schema: string, limit: number) => {
  const order = 'desc'
  const filter: XyoArchivePayloadFilterPredicate = { archive, limit, order, schema }
  const query: XyoArchivistFindQuery = {
    filter,
    schema: XyoArchivistFindQuerySchema,
  }
  return archivist.query(query)
}

const handler: RequestHandler<ArchiveSchemaPayloadsRecentPathParams> = async (req, res) => {
  const { archive, schema, limit } = req.params
  const { archivePayloadsArchivist: archivist } = req.app
  const limitNumber = tryParseInt(limit) ?? 20
  assertEx(limitNumber > 0 && limitNumber <= 100, 'limit must be between 1 and 100')
  assertEx(schema, 'schema must be supplied')
  const schemas = (await getRecentPayloadsOfSchemaForArchive(archivist, archive, schema, limitNumber))?.[1] || []
  res.json(schemas)
}

export const getArchiveSchemaPayloadsRecent = asyncHandler(handler)
