import { requireArchiveAccess } from '@xyo-network/archivist-middleware'
import { Express } from 'express'

import { getArchiveSchemaPayloadsRecent, getArchiveSchemaRecent, postArchiveSchemaCurrentWitness } from '../routes'

export const addArchiveSchemaRoutes = (app: Express) => {
  app.post(
    '/archive/:archive/schema/current/witness',
    requireArchiveAccess,
    postArchiveSchemaCurrentWitness,
    /* #swagger.tags = ['Schema'] */
    /* #swagger.summary = 'Snapshot current schema payload hashes for the archive' */
  )

  app.get(
    '/archive/:archive/schema/recent/:limit?',
    requireArchiveAccess,
    getArchiveSchemaRecent,
    /* #swagger.tags = ['Schema'] */
    /* #swagger.summary = 'Get recent schema for the archive' */
  )

  app.get(
    '/archive/:archive/schema/:schema/recent/:limit?',
    requireArchiveAccess,
    getArchiveSchemaPayloadsRecent,
    /* #swagger.tags = ['Schema'] */
    /* #swagger.summary = 'Get recent payloads of the supplied schema type for the archive' */
  )
}
