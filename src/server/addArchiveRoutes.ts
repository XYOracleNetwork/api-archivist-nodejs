import { Express } from 'express'

import { getArchive, getArchives, getArchiveSettingsKeys, postArchiveSettingsKeys, putArchive } from '../archive'
import { requireArchiveOwner, requireAuth } from '../middleware'
import { notImplemented } from './notImplemented'

export const addArchiveRoutes = (app: Express) => {
  app.get(
    '/archive',
    getArchives
    /* #swagger.tags = ['Archive'] */
    /* #swagger.summary = 'Get list of archives on archivist' */
  )

  app.get(
    '/archive/:archive',
    requireArchiveOwner,
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

  app.get(
    '/archive/:archive/settings/keys',
    requireArchiveOwner,
    getArchiveSettingsKeys
    /* #swagger.tags = ['Archive'] */
    /* #swagger.summary = 'Gets the list of keys for a specific archive' */
  )

  app.post(
    '/archive/:archive/settings/keys',
    requireArchiveOwner,
    postArchiveSettingsKeys
    /* #swagger.tags = ['Archive'] */
    /* #swagger.summary = 'Sets the list of keys for a specific archive' */
  )
}
