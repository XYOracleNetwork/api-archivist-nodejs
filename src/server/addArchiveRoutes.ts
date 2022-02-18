import { Express } from 'express'

import { getArchive, getArchives, getArchiveSettingsKeys, postArchiveSettingsKeys, putArchive } from '../archive'
import { requireArchiveOwner, requireAuth } from '../middleware'
import { notImplemented } from './notImplemented'

export const addArchiveRoutes = (app: Express) => {
  app.get(
    '/archive',
    requireAuth,
    getArchives
    /* #swagger.tags = ['archive'] */
    /* #swagger.summary = 'Get list of archives on archivist' */
  )

  app.get(
    '/archive/:archive',
    requireArchiveOwner,
    getArchive
    /* #swagger.tags = ['archive'] */
    /* #swagger.summary = 'Get archive configuration' */
  )

  app.put(
    '/archive/:archive',
    requireAuth,
    putArchive
    /* #swagger.tags = ['archive'] */
    /* #swagger.summary = 'Put archive configuration' */
  )

  app.delete(
    '/archive/:archive',
    requireArchiveOwner,
    notImplemented
    /* #swagger.tags = ['archive'] */
    /* #swagger.summary = 'Delete an archive' */
  )

  app.get(
    '/archive/:archive/settings/keys',
    requireArchiveOwner,
    getArchiveSettingsKeys
    /* #swagger.tags = ['archive'] */
    /* #swagger.summary = 'Gets the list of keys for a specific archive' */
  )

  app.post(
    '/archive/:archive/settings/keys',
    requireArchiveOwner,
    postArchiveSettingsKeys
    /* #swagger.tags = ['archive'] */
    /* #swagger.summary = 'Sets the list of keys for a specific archive' */
  )
}
