import { Express } from 'express'

import { allowAnonymous } from '../middleware'
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
}
