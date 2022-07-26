import { notImplemented } from '@xylabs/sdk-api-express-ecs'
import { getArchivePayloadSchemas, getArchivePayloadSchemaStats } from '@xyo-network/archivist-archive'
import { requireArchiveAccess } from '@xyo-network/archivist-middleware'
import { Express } from 'express'

export const addPayloadSchemaRoutes = (app: Express) => {
  app.get(
    '/archive/:archive/payload/schema',
    requireArchiveAccess,
    getArchivePayloadSchemas
    /* #swagger.tags = ['Schema'] */
    /* #swagger.summary = 'Get list of payload schemas used in this archive' */
  )

  app.get(
    '/archive/:archive/payload/schema/stats',
    requireArchiveAccess,
    getArchivePayloadSchemaStats
    /* #swagger.tags = ['Schema'] */
    /* #swagger.summary = 'Get payload schema stats' */
  )

  app.get(
    '/archive/:archive/payload/schema/:schema',
    requireArchiveAccess,
    notImplemented
    /* #swagger.deprecated = true */
    /* #swagger.tags = ['Schema'] */
    /* #swagger.summary = 'Get payloads filtered by schema' */
  )

  app.get(
    '/archive/:archive/payload/schema/:schema/stats',
    requireArchiveAccess,
    notImplemented
    /* #swagger.deprecated = true */
    /* #swagger.tags = ['Schema'] */
    /* #swagger.summary = 'Get payload stats filtered by schema' */
  )

  app.get(
    '/archive/:archive/payload/schema/:schema/recent/limit',
    requireArchiveAccess,
    notImplemented
    /* #swagger.deprecated = true */
    /* #swagger.tags = ['Schema'] */
    /* #swagger.summary = 'Get recent payloads filtered by schema' */
  )
}
