import { Express } from 'express'

import { standardErrors } from '../middleware'

export const addErrorHandlers = (app: Express) => {
  app.use(standardErrors)
}
