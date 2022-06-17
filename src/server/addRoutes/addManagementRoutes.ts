import { Express } from 'express'

import { postMigrateLegacyArchivePermissions, postMigrateLegacyArchivesPermissions } from '../../management'
import { requireAdminApiKey } from '../../middleware'

export const addManagementRoutes = (app: Express) => {
  app.post(
    '/management/migrateLegacyArchivePermissions',
    requireAdminApiKey,
    postMigrateLegacyArchivesPermissions
    /* #swagger.tags = ['Management'] */
    /* #swagger.ignore = true */
    /* #swagger.summary = 'Migrate multiple archives from using legacy permissions objects to new Payload-based permissions' */
  )
  app.post(
    '/management/migrateLegacyArchivePermissions/:archive',
    requireAdminApiKey,
    postMigrateLegacyArchivePermissions
    /* #swagger.tags = ['Management'] */
    /* #swagger.ignore = true */
    /* #swagger.summary = 'Migrate a single archive from using legacy permissions to new Payload-based permissions' */
  )
}
