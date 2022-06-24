import { notImplemented } from '@xylabs/sdk-api-express-ecs'
import { Express } from 'express'

import { allowAnonymous } from '../../middleware'
import { getSchema } from '../../schema'

export const addSchemaRoutes = (app: Express) => {
  app.get(
    '/schema',
    allowAnonymous,
    notImplemented
    /* #swagger.deprecated = true */
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
