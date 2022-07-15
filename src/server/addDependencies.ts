import { Application } from 'express'

import dependencies from '../inversify.config'
import {
  ArchiveArchivist,
  ArchivePermissionsArchivist,
  Query,
  SchemaToQueryProcessorRegistry,
  UserManager,
  WitnessedPayloadArchivist,
  XyoPayloadToQueryConverterRegistry,
} from '../middleware'
import { IdentifiableHuri, Queue } from '../Queue'

export const addDependencies = (app: Application) => {
  app.archivistWitnessedPayloadArchivist = dependencies.get<WitnessedPayloadArchivist>('ArchivistWitnessedPayloadRepository')
  app.archiveArchivist = dependencies.get<ArchiveArchivist>('ArchiveRepository')
  app.archivePermissionsArchivist = dependencies.get<ArchivePermissionsArchivist>('ArchivePermissionsRepository')
  app.queryConverters = dependencies.get<XyoPayloadToQueryConverterRegistry>('XyoPayloadToQueryConverterRegistry')
  app.queryProcessors = dependencies.get<SchemaToQueryProcessorRegistry>('SchemaToQueryProcessorRegistry')
  app.queryQueue = dependencies.get<Queue<Query>>('Queue<Query>')
  app.responseQueue = dependencies.get<Queue<IdentifiableHuri>>('Queue<IdentifiableHuri>')
  app.userManager = dependencies.get<UserManager>('UserManager')
}
