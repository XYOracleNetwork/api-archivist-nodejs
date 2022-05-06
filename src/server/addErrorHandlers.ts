import { standardErrors } from '@xylabs/sdk-api-express-ecs'
import { Express } from 'express'

import { rollbarErrorHandler } from '../middleware'

export const addErrorHandlers = (app: Express) => {
  app.use(rollbarErrorHandler())
  app.use(standardErrors)
}
