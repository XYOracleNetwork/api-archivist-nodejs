import 'source-map-support/register'

import { assertEx } from '@xylabs/assert'
import { asyncHandler, tryParseInt } from '@xylabs/sdk-api-express-ecs'
import { ArchivePayloadsArchivist, XyoArchivePayloadFilterPredicate } from '@xyo-network/archivist-model'
import { RequestHandler } from 'express'

import { ArchiveSchemaRecentPathParams } from './ArchiveSchemaRecentPathParams'

const getRecentSchemasForArchive = (archivist: ArchivePayloadsArchivist, archive: string, limit: number) => {
  const order = 'desc'
  const schema = 'network.xyo.schema'
  const query: XyoArchivePayloadFilterPredicate = { archive, limit, order, schema }
  return archivist.find(query)
}

const handler: RequestHandler<ArchiveSchemaRecentPathParams> = async (req, res) => {
  const { archive, limit } = req.params
  const { archivePayloadsArchivist: archivist } = req.app
  const limitNumber = tryParseInt(limit) ?? 20
  assertEx(limitNumber > 0 && limitNumber <= 100, 'limit must be between 1 and 100')
  const schemas = (await getRecentSchemasForArchive(archivist, archive, limitNumber)) || []
  res.json(schemas)
}

export const getArchiveSchemaRecent = asyncHandler(handler)
