import { Application } from 'express-serve-static-core'

import { MongoDBArchiveRepository, MongoDBUserManager, MongoDBUserRepository, XyoSchemaToPayloadProcessorRegistry } from '../middleware'

export const addDependencies = (app: Application) => {
  const userRepository = new MongoDBUserRepository()
  app.archiveRepository = new MongoDBArchiveRepository()
  app.payloadProcessorRegistry = new XyoSchemaToPayloadProcessorRegistry(app)
  app.userManager = new MongoDBUserManager(userRepository)
  app.userRepository = userRepository
}
