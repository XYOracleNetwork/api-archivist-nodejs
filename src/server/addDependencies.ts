import { Application } from 'express'

import dependencies from '../inversify.config'
import { getQueryQueue, getResponseQueue } from '../lib'
import {
  ArchivePermissionsRepository,
  ArchivistWitnessedPayloadRepository,
  MongoDBArchiveRepository,
  SchemaToQueryProcessorRegistry,
  UserManager,
  XyoPayloadToQueryConverterRegistry,
} from '../middleware'

export const addDependencies = (app: Application) => {
  app.archivistWitnessedPayloadRepository = dependencies.get<ArchivistWitnessedPayloadRepository>('ArchivistWitnessedPayloadRepository')
  app.archiveRepository = dependencies.get<MongoDBArchiveRepository>(MongoDBArchiveRepository)
  app.archivePermissionsRepository = dependencies.get<ArchivePermissionsRepository>('ArchivePermissionsRepository')
  app.queryConverters = new XyoPayloadToQueryConverterRegistry(app)
  app.queryProcessors = new SchemaToQueryProcessorRegistry(app)
  app.queryQueue = getQueryQueue()
  app.responseQueue = getResponseQueue()
  app.userManager = dependencies.get<UserManager>('UserManager')
}
