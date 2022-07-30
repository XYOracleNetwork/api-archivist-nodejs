import { standardErrors } from '@xylabs/sdk-api-express-ecs'
import { rollbarErrorHandler } from '@xyo-network/archivist-middleware'
import { Express } from 'express'

export const addErrorHandlers = (app: Express) => {
  app.use(rollbarErrorHandler())
  app.use(standardErrors)
}
