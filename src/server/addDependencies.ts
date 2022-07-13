import { Application } from 'express'

import dependencies from '../inversify.config'
import {
  ArchivePermissionsRepository,
  ArchiveRepository,
  ArchivistWitnessedPayloadRepository,
  Query,
  SchemaToQueryProcessorRegistry,
  UserManager,
  XyoPayloadToQueryConverterRegistry,
} from '../middleware'
import { IdentifiableHuri, Queue } from '../Queue'

export const addDependencies = (app: Application) => {
  app.archivistWitnessedPayloadRepository = dependencies.get<ArchivistWitnessedPayloadRepository>('ArchivistWitnessedPayloadRepository')
  app.archiveRepository = dependencies.get<ArchiveRepository>('ArchiveRepository')
  app.archivePermissionsRepository = dependencies.get<ArchivePermissionsRepository>('ArchivePermissionsRepository')
  app.queryConverters = new XyoPayloadToQueryConverterRegistry(app)
  app.queryProcessors = new SchemaToQueryProcessorRegistry(app)
  app.queryQueue = dependencies.get<Queue<Query>>('Queue<Query>')
  app.responseQueue = dependencies.get<Queue<IdentifiableHuri>>('Queue<IdentifiableHuri>')
  app.userManager = dependencies.get<UserManager>('UserManager')
}
