import { assertEx } from '@xylabs/assert'
import { dependencies } from '@xyo-network/archivist-dependencies'
import { SchemaToQueryProcessorRegistry, XyoPayloadToQueryConverterRegistry } from '@xyo-network/archivist-middleware'
import {
  ArchiveArchivist,
  ArchiveBoundWitnessArchivist,
  ArchiveKeyArchivist,
  ArchivePayloadsArchivist,
  ArchivePermissionsArchivist,
  BoundWitnessesArchivist,
  BoundWitnessStatsDiviner,
  PayloadsArchivist,
  PayloadStatsDiviner,
  Query,
  SchemaStatsDiviner,
  UserManager,
  WitnessedPayloadArchivist,
} from '@xyo-network/archivist-model'
import { IdentifiableHuri, Queue } from '@xyo-network/archivist-queue'
import { TYPES } from '@xyo-network/archivist-types'
import { Application } from 'express'

export const addDependencies = (app: Application) => {
  app.archivistWitnessedPayloadArchivist = assertEx(
    dependencies.get<WitnessedPayloadArchivist>(TYPES.WitnessedPayloadArchivist),
    'Missing ArchivistWitnessedPayloadArchivist',
  )
  app.archiveArchivist = assertEx(dependencies.get<ArchiveArchivist>(TYPES.ArchiveArchivist), 'Missing ArchiveArchivist')
  app.ArchiveBoundWitnessArchivist = assertEx(
    dependencies.get<ArchiveBoundWitnessArchivist>(TYPES.ArchiveBoundWitnessArchivist),
    'Missing ArchiveBoundWitnessArchivist',
  )
  app.archivePayloadsArchivist = assertEx(
    dependencies.get<ArchivePayloadsArchivist>(TYPES.ArchivePayloadsArchivist),
    'Missing ArchivePayloadsArchivist',
  )
  app.archiveArchivist = assertEx(dependencies.get<ArchiveArchivist>(TYPES.ArchiveArchivist), 'Missing ArchiveArchivist')
  app.archiveKeyArchivist = assertEx(dependencies.get<ArchiveKeyArchivist>(TYPES.ArchiveKeyArchivist), 'Missing ArchiveKeyArchivist')
  app.archivePermissionsArchivist = assertEx(
    dependencies.get<ArchivePermissionsArchivist>(TYPES.ArchivePermissionsArchivist),
    'Missing ArchivePermissionsArchivist',
  )
  app.schemaStatsDiviner = assertEx(dependencies.get<SchemaStatsDiviner>(TYPES.SchemaStatsDiviner), 'Missing SchemaStatsDiviner')
  app.boundWitnessStatsDiviner = assertEx(
    dependencies.get<BoundWitnessStatsDiviner>(TYPES.BoundWitnessStatsDiviner),
    'Missing BoundWitnessStatsDiviner',
  )
  app.boundWitnessesArchivist = assertEx(dependencies.get<BoundWitnessesArchivist>(TYPES.BoundWitnessesArchivist), 'Missing BoundWitnessesArchivist')
  app.payloadStatsDiviner = assertEx(dependencies.get<PayloadStatsDiviner>(TYPES.PayloadStatsDiviner), 'Missing PayloadStatsDiviner')
  app.payloadsArchivist = assertEx(dependencies.get<PayloadsArchivist>(TYPES.PayloadsArchivist), 'Missing PayloadsArchivist')
  app.queryConverters = assertEx(
    dependencies.get<XyoPayloadToQueryConverterRegistry>(TYPES.PayloadToQueryConverterRegistry),
    'Missing QueryConverters',
  )
  app.queryProcessors = assertEx(dependencies.get<SchemaToQueryProcessorRegistry>(TYPES.SchemaToQueryProcessorRegistry), 'Missing QueryProcessors')
  app.queryQueue = assertEx(dependencies.get<Queue<Query>>(TYPES.QueryQueue), 'Missing QueryQueue')
  app.responseQueue = assertEx(dependencies.get<Queue<IdentifiableHuri>>(TYPES.ResponseQueue), 'Missing ResponseQueue')
  app.userManager = assertEx(dependencies.get<UserManager>(TYPES.UserManager), 'Missing UserManager')
}
