import { Application } from 'express'

import {
  MongoDBArchivePermissionsPayloadPayloadRepository,
  MongoDBArchiveRepository,
  MongoDBUserManager,
  MongoDBUserRepository,
  XyoSchemaToPayloadProcessorRegistry,
} from '../middleware'

export const addDependencies = (app: Application) => {
  app.archiveRepository = new MongoDBArchiveRepository()
  app.archivePermissionsRepository = new MongoDBArchivePermissionsPayloadPayloadRepository()
  app.payloadProcessorRegistry = new XyoSchemaToPayloadProcessorRegistry(app)
  app.userManager = new MongoDBUserManager(new MongoDBUserRepository())
}
