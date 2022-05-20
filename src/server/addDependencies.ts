import { Application } from 'express-serve-static-core'

import { MongoDBArchiveRepository, MongoDBUserManager, MongoDBUserRepository, XyoSchemaToPayloadProcessorRegistry } from '../middleware'

export const addDependencies = (app: Application) => {
  app.archiveRepository = new MongoDBArchiveRepository()
  app.payloadProcessorRegistry = new XyoSchemaToPayloadProcessorRegistry(app)
  app.userManager = new MongoDBUserManager(new MongoDBUserRepository())
}
