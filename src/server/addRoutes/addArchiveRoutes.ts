import { Express } from 'express'

import { getArchive, getArchives, putArchive } from '../../archive'
import { allowAnonymous, requireArchiveAccess, requireArchiveOwner, requireAuth } from '../../middleware'
import { addArchiveSettingsRoutes } from './addArchiveSettingsRoutes'
import { notImplemented } from './notImplemented'

export const addArchiveRoutes = (app: Express) => {
  app.get(
    '/archive',
    allowAnonymous,
    getArchives
    /* #swagger.tags = ['Archive'] */
    /* #swagger.summary = 'Get list of archives on archivist' */
  )

  app.get(
    '/archive/:archive',
    requireArchiveAccess,
    getArchive
    /* #swagger.tags = ['Archive'] */
    /* #swagger.summary = 'Get archive configuration' */
  )

  app.put(
    '/archive/:archive',
    requireAuth,
    putArchive
    /* #swagger.tags = ['Archive'] */
    /* #swagger.summary = 'Put archive configuration' */
  )

  app.delete(
    '/archive/:archive',
    requireArchiveOwner,
    notImplemented
    /* #swagger.tags = ['Archive'] */
    /* #swagger.summary = 'Delete an archive' */
  )

  addArchiveSettingsRoutes(app)
}
