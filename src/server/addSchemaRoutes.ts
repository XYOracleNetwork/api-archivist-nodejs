import { Express } from 'express'

import { allowAnonymous } from '../middleware'
import { getSchema, getSchemaRecent, getSchemas } from '../schema'

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
    '/schema/recent/:limit?',
    allowAnonymous,
    getSchemaRecent
    /* #swagger.tags = ['Block'] */
    /* #swagger.summary = 'Get the most recent blocks' */
  )
}
