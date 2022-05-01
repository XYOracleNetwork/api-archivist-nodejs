import { standardErrors } from '@xylabs/sdk-api-express-ecs'
import { Express } from 'express'

import { jsonSchemaErrorHandler, rollbarErrorHandler } from '../middleware'

export const addErrorHandlers = (app: Express) => {
  app.use(jsonSchemaErrorHandler)
  app.use(rollbarErrorHandler())
  app.use(standardErrors)
}
