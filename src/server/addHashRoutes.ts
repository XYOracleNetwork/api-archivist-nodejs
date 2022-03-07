import { Express } from 'express'

import { getByHash } from '../hash'
import { allowAnonymous } from '../middleware'

export const addHashRoutes = (app: Express) => {
  app.get(
    '/:hash',
    allowAnonymous,
    getByHash
    /* #swagger.tags = ['Archive'] */
    /* #swagger.summary = 'Get list of archives on archivist' */
  )
}
