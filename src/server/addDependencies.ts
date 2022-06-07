import { Application } from 'express'

import {
  getAccountFromSeedPhrase,
  MongoDBArchivePermissionsPayloadPayloadRepository,
  MongoDBArchiveRepository,
  MongoDBArchivistWitnessedPayloadRepository,
  MongoDBUserManager,
  MongoDBUserRepository,
  XyoPayloadToQueryConverterRegistry,
  XyoSchemaToPayloadProcessorRegistry,
} from '../middleware'
import { InMemoryQueryQueue } from '../QueryQueue'

export const addDependencies = (app: Application) => {
  const account = getAccountFromSeedPhrase(process.env.ACCOUNT_SEED)
  app.account = account
  app.archivistWitnessedPayloadRepository = new MongoDBArchivistWitnessedPayloadRepository(account)
  app.archiveRepository = new MongoDBArchiveRepository()
  app.archivePermissionsRepository = new MongoDBArchivePermissionsPayloadPayloadRepository()
  app.payloadProcessorRegistry = new XyoSchemaToPayloadProcessorRegistry(app)
  app.queryQueue = new InMemoryQueryQueue()
  app.requestToQueryConverterRegistry = new XyoPayloadToQueryConverterRegistry(app)
  app.userManager = new MongoDBUserManager(new MongoDBUserRepository())
}
