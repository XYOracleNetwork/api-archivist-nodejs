import { Application } from 'express-serve-static-core'

import { XyoSchemaToPayloadProcessorRegistry } from '../middleware'

export const addDependencies = (app: Application) => {
  app.payloadProcessorRegistry = new XyoSchemaToPayloadProcessorRegistry(app)
}
