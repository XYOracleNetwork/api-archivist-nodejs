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
  app.archivistWitnessedPayloadRepository = dependencies.get<ArchivistWitnessedPayloadRepository>(nameof<ArchivistWitnessedPayloadRepository>())
  app.archiveRepository = dependencies.get<ArchiveRepository>(nameof<ArchiveRepository>())
  app.archivePermissionsRepository = dependencies.get<ArchivePermissionsRepository>(nameof<ArchivePermissionsRepository>())
  app.queryConverters = dependencies.get<XyoPayloadToQueryConverterRegistry>(nameof<XyoPayloadToQueryConverterRegistry>())
  app.queryProcessors = dependencies.get<SchemaToQueryProcessorRegistry>(nameof<SchemaToQueryProcessorRegistry>())
  app.queryQueue = dependencies.get<Queue<Query>>(nameof<Queue<Query>>())
  app.responseQueue = dependencies.get<Queue<IdentifiableHuri>>(nameof<Queue<IdentifiableHuri>>())
  app.userManager = dependencies.get<UserManager>(nameof<UserManager>())
}
