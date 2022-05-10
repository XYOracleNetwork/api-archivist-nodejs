import { Express } from 'express'

import { getArchivePayloadSchemaStats, getArchiveSchemaPayloadsRecent, getArchiveSchemaRecent, postArchiveSchemaCurrentWitness } from '../archive'
import { allowAnonymous, requireArchiveAccess } from '../middleware'
import { getSchema, getSchemas } from '../schema'

export const addSchemaRoutes = (app: Express) => {
  app.get(
    '/schema',
    allowAnonymous,
    getSchemas
    /* #swagger.tags = ['Schema'] */
    /* #swagger.summary = 'Get list of known schemas on archivist' */
  )

  app.get(
    '/schema/:schema',
    allowAnonymous,
    getSchema
    /* #swagger.tags = ['Schema'] */
    /* #swagger.summary = 'Get specific schema if known by archivist' */
  )

  app.get(
    '/archive/:archive/payload/schema/stats',
    requireArchiveAccess,
    getArchivePayloadSchemaStats
    /* #swagger.tags = ['Schema'] */
    /* #swagger.summary = 'Get payload schema stats' */
  )

  app.post(
    '/archive/:archive/schema/current/witness',
    requireArchiveAccess,
    postArchiveSchemaCurrentWitness
    /* #swagger.tags = ['Schema'] */
    /* #swagger.summary = 'Snapshot current schema payload hashes for the archive' */
  )

  app.get(
    '/archive/:archive/schema/recent/:limit?',
    requireArchiveAccess,
    getArchiveSchemaRecent
    /* #swagger.tags = ['Schema'] */
    /* #swagger.summary = 'Get recent schema for the archive' */
  )

  app.get(
    '/archive/:archive/schema/:schema/recent/:limit?',
    requireArchiveAccess,
    getArchiveSchemaPayloadsRecent
    /* #swagger.tags = ['Schema'] */
    /* #swagger.summary = 'Get recent payloads of the supplied schema type for the archive' */
  )
}
