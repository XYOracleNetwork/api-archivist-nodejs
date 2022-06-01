import { Express } from 'express'

import { getArchiveSettingsKeys, postArchiveSettingsKeys } from '../../archive'
import { requireArchiveOwner } from '../../middleware'

export const addArchiveSettingsRoutes = (app: Express) => {
  app.get(
    '/archive/:archive/settings/key',
    requireArchiveOwner,
    getArchiveSettingsKeys
    /* #swagger.tags = ['Archive'] */
    /* #swagger.summary = 'Gets the list of keys for a specific archive' */
  )

  app.post(
    '/archive/:archive/settings/key',
    requireArchiveOwner,
    postArchiveSettingsKeys
    /* #swagger.tags = ['Archive'] */
    /* #swagger.summary = 'Sets the list of keys for a specific archive' */
  )

  app.delete(
    '/archive/:archive/settings/key',
    requireArchiveOwner,
    postArchiveSettingsKeys
    /* #swagger.tags = ['Archive'] */
    /* #swagger.summary = 'Deletes a specific key for a specific archive' */
  )

  app.get(
    '/archive/:archive/settings/key/:key',
    requireArchiveOwner,
    getArchiveSettingsKeys
    /* #swagger.tags = ['Archive'] */
    /* #swagger.summary = 'Gets the configuration of a specific key for a specific archive' */
  )

  app.post(
    '/archive/:archive/settings/key/:key',
    requireArchiveOwner,
    postArchiveSettingsKeys
    /* #swagger.tags = ['Archive'] */
    /* #swagger.summary = 'Sets the configuration of a specific key for a specific archive' */
  )

  app.delete(
    '/archive/:archive/settings/key/:key',
    requireArchiveOwner,
    postArchiveSettingsKeys
    /* #swagger.tags = ['Archive'] */
    /* #swagger.summary = 'Deletes a specific key for a specific archive' */
  )
}
