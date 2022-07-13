import { XyoAccount } from '@xyo-network/account'
import { Application } from 'express'

import dependencies from '../inversify.config'
import { getQueryQueue, getResponseQueue } from '../lib'
import {
  MongoDBArchivePermissionsPayloadPayloadRepository,
  MongoDBArchiveRepository,
  MongoDBArchivistWitnessedPayloadRepository,
  MongoDBUserManager,
  MongoDBUserRepository,
  SchemaToQueryProcessorRegistry,
  XyoPayloadToQueryConverterRegistry,
} from '../middleware'

export const addDependencies = (app: Application) => {
  const account = dependencies.get<XyoAccount>(XyoAccount)
  app.archivistWitnessedPayloadRepository = new MongoDBArchivistWitnessedPayloadRepository(account)
  app.archiveRepository = new MongoDBArchiveRepository()
  app.archivePermissionsRepository = new MongoDBArchivePermissionsPayloadPayloadRepository(account)
  app.queryConverters = new XyoPayloadToQueryConverterRegistry(app)
  app.queryProcessors = new SchemaToQueryProcessorRegistry(app)
  app.queryQueue = getQueryQueue()
  app.responseQueue = getResponseQueue()
  app.userManager = new MongoDBUserManager(new MongoDBUserRepository())
}
