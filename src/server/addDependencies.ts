import { Application } from 'express-serve-static-core'

import { MongoDBArchiveRepository, XyoSchemaToPayloadProcessorRegistry } from '../middleware'

export const addDependencies = (app: Application) => {
  app.archiveRepository = new MongoDBArchiveRepository()
  app.payloadProcessorRegistry = new XyoSchemaToPayloadProcessorRegistry(app)
}
