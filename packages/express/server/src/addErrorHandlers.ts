import { standardErrors } from '@xylabs/sdk-api-express-ecs'
import { loggingErrorHandler } from '@xyo-network/archivist-middleware'
import { Express } from 'express'

export const addErrorHandlers = (app: Express) => {
  app.use(loggingErrorHandler(console))
  app.use(standardErrors)
}
