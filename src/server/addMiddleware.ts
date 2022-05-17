import {
  customPoweredByHeader,
  disableCaseSensitiveRouting,
  disableExpressDefaultPoweredByHeader,
  jsonBodyParser,
  responseProfiler,
  useRequestCounters,
} from '@xylabs/sdk-api-express-ecs'
import { Express } from 'express'

import { archiveLocals, standardResponses, usePayloadProcessors } from '../middleware'

export const addMiddleware = (app: Express) => {
  app.use(responseProfiler)
  app.use(jsonBodyParser)
  app.use(standardResponses)
  disableExpressDefaultPoweredByHeader(app)
  app.use(customPoweredByHeader)
  disableCaseSensitiveRouting(app)
  usePayloadProcessors(app)
  app.use('/archive/:archive', archiveLocals)
  useRequestCounters(app)
}
