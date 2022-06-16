import { Express } from 'express'

import { postMigrateLegacyArchivePermissions } from '../../management'
import { requireAdminApiKey } from '../../middleware'

export const addManagementRoutes = (app: Express) => {
  app.post(
    '/management/migrateLegacyArchivePermissions',
    requireAdminApiKey,
    postMigrateLegacyArchivePermissions
    /* #swagger.tags = ['Block'] */
    /* #swagger.summary = 'Get blocks' */
  )
}
