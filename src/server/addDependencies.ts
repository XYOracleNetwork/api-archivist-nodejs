import { Application } from 'express-serve-static-core'

import { MongoDBArchiveRepository, MongoDBUserRepository, XyoSchemaToPayloadProcessorRegistry } from '../middleware'

export const addDependencies = (app: Application) => {
  app.archiveRepository = new MongoDBArchiveRepository()
  app.payloadProcessorRegistry = new XyoSchemaToPayloadProcessorRegistry(app)
  app.userRepository = new MongoDBUserRepository()
}
