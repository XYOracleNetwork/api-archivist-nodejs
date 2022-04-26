import { Express } from 'express'

import { getArchiveSchemaRecent } from '../archive'
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
    '/archive/:archive/schema/recent/:limit?',
    requireArchiveAccess,
    getArchiveSchemaRecent
    /* #swagger.tags = ['Schema'] */
    /* #swagger.summary = 'Get recent schema for the archive' */
  )
}
