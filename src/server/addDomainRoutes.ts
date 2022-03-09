import { Express } from 'express'

import { getDomain } from '../domain'
import { allowAnonymous } from '../middleware'

export const addDomainRoutes = (app: Express) => {
  app.get(
    '/domain/:domain',
    allowAnonymous,
    getDomain
    /* #swagger.tags = ['Domain'] */
    /* #swagger.summary = 'Get specific config for a specific domain' */
  )
}
