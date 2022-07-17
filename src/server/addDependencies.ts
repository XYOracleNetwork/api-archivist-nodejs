import { Application } from 'express'

import { dependencies, TYPES } from '../Dependencies'
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
  app.archivistWitnessedPayloadArchivist = dependencies.get<WitnessedPayloadArchivist>(TYPES.WitnessedPayloadArchivist)
  app.archiveArchivist = dependencies.get<ArchiveArchivist>(TYPES.ArchiveArchivist)
  app.archivePermissionsArchivist = dependencies.get<ArchivePermissionsArchivist>(TYPES.ArchivePermissionsArchivist)
  app.queryConverters = dependencies.get<XyoPayloadToQueryConverterRegistry>(TYPES.PayloadToQueryConverterRegistry)
  app.queryProcessors = dependencies.get<SchemaToQueryProcessorRegistry>(TYPES.SchemaToQueryProcessorRegistry)
  app.queryQueue = dependencies.get<Queue<Query>>(TYPES.QueryQueue)
  app.responseQueue = dependencies.get<Queue<IdentifiableHuri>>(TYPES.ResponseQueue)
  app.userManager = dependencies.get<UserManager>(TYPES.UserManager)
}
