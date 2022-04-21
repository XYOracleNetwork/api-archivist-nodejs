import { jsonBodyParser } from '@xylabs/sdk-api-express-ecs'
import { Express } from 'express'

import { archiveLocals, responseProfiler, standardResponses, useRequestCounters } from '../middleware'

export const addMiddleware = (app: Express) => {
  app.use(responseProfiler)
  app.use(jsonBodyParser)
  app.use(standardResponses)
  app.use('/archive/:archive', archiveLocals)
  useRequestCounters(app)
}
