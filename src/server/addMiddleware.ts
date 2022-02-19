import { Express } from 'express'

import {
  archiveLocals,
  jsonBodyParser,
  responseProfiler,
  standardErrors,
  standardResponses,
  useRequestCounters,
} from '../middleware'

export const addMiddleware = (app: Express) => {
  app.use(responseProfiler)
  app.use(jsonBodyParser)
  app.use(standardResponses)
  app.use('/archive/:archive', archiveLocals)
  useRequestCounters(app)
  app.use(standardErrors)
}
