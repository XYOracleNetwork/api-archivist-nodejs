import { Express } from 'express'

import { requireArchiveAccess } from '../middleware'
import { notImplemented } from './notImplemented'

export const addPayloadSchemaRoutes = (app: Express) => {
  app.get(
    '/archive/:archive/payload/schema',
    requireArchiveAccess,
    notImplemented
    /* #swagger.tags = ['schema'] */
    /* #swagger.summary = 'Get list of payload schemas used in this archive' */
  )

  app.get(
    '/archive/:archive/payload/schema/:schema',
    requireArchiveAccess,
    notImplemented
    /* #swagger.tags = ['schema'] */
    /* #swagger.summary = 'Get payloads filtered by schema' */
  )

  app.get(
    '/archive/:archive/payload/schema/:schema/stats',
    requireArchiveAccess,
    notImplemented
    /* #swagger.tags = ['schema'] */
    /* #swagger.summary = 'Get payload stats filtered by schema' */
  )

  app.get(
    '/archive/:archive/payload/schema/:schema/recent/limit',
    requireArchiveAccess,
    notImplemented
    /* #swagger.tags = ['schema'] */
    /* #swagger.summary = 'Get recent payloads filtered by schema' */
  )
}
