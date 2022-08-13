import { dependencies } from '@xyo-network/archivist-dependencies'
import { SchemaToQueryProcessorRegistry, XyoPayloadToQueryConverterRegistry } from '@xyo-network/archivist-middleware'
import {
  ArchiveArchivist,
  ArchiveKeyArchivist,
  ArchivePermissionsArchivist,
  Query,
  UserManager,
  WitnessedPayloadArchivist,
} from '@xyo-network/archivist-model'
import { IdentifiableHuri, Queue } from '@xyo-network/archivist-queue'
import { TYPES } from '@xyo-network/archivist-types'
import { Application } from 'express'

export const addDependencies = (app: Application) => {
  app.archivistWitnessedPayloadArchivist = dependencies.get<WitnessedPayloadArchivist>(TYPES.WitnessedPayloadArchivist)
  app.archiveArchivist = dependencies.get<ArchiveArchivist>(TYPES.ArchiveArchivist)
  app.archiveKeyArchivist = dependencies.get<ArchiveKeyArchivist>(TYPES.ArchiveKeyArchivist)
  app.archivePermissionsArchivist = dependencies.get<ArchivePermissionsArchivist>(TYPES.ArchivePermissionsArchivist)
  app.queryConverters = dependencies.get<XyoPayloadToQueryConverterRegistry>(TYPES.PayloadToQueryConverterRegistry)
  app.queryProcessors = dependencies.get<SchemaToQueryProcessorRegistry>(TYPES.SchemaToQueryProcessorRegistry)
  app.queryQueue = dependencies.get<Queue<Query>>(TYPES.QueryQueue)
  app.responseQueue = dependencies.get<Queue<IdentifiableHuri>>(TYPES.ResponseQueue)
  app.userManager = dependencies.get<UserManager>(TYPES.UserManager)
}
