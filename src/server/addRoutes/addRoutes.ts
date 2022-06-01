import { Express } from 'express'

import { configureAuth } from '../../middleware'
import { addArchiveRoutes } from './addArchiveRoutes'
import { addBlockRoutes } from './addBlockRoutes'
import { addDomainRoutes } from './addDomainRoutes'
import { addNodeRoutes } from './addNodeRoutes'
import { addPayloadRoutes } from './addPayloadRoutes'
import { addPayloadSchemaRoutes } from './addPayloadSchemaRoutes'
import { addSchemaRoutes } from './addSchemaRoutes'

export const addRoutes = (app: Express): Express => {
  addArchiveRoutes(app)
  addBlockRoutes(app)
  addPayloadRoutes(app)
  addPayloadSchemaRoutes(app)
  addSchemaRoutes(app)
  addDomainRoutes(app)

  const userRoutes = configureAuth({
    apiKey: process.env.API_KEY,
    secretOrKey: process.env.JWT_SECRET,
  })
  app.use('', userRoutes)

  // This needs to be the last true route handler since it is
  // a catch-all for the root paths
  addNodeRoutes(app)
  return app
}
