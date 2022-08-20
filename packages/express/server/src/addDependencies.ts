import { assertEx } from '@xylabs/assert'
import { dependencies } from '@xyo-network/archivist-dependencies'
import { SchemaToQueryProcessorRegistry, XyoPayloadToQueryConverterRegistry } from '@xyo-network/archivist-middleware'
import {
  ArchiveArchivist,
  ArchiveBoundWitnessesArchivist,
  ArchiveKeyArchivist,
  ArchivePayloadsArchivist,
  ArchivePermissionsArchivist,
  ArchiveSchemaCountDiviner,
  ArchiveSchemaListDiviner,
  BoundWitnessesArchivist,
  BoundWitnessStatsDiviner,
  PayloadsArchivist,
  PayloadStatsDiviner,
  Query,
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
  app.archiveBoundWitnessesArchivist = assertEx(
    dependencies.get<ArchiveBoundWitnessesArchivist>(TYPES.ArchiveBoundWitnessesArchivist),
    'Missing ArchiveBoundWitnessesArchivist',
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
  app.archiveSchemaCountDiviner = assertEx(
    dependencies.get<ArchiveSchemaCountDiviner>(TYPES.ArchiveSchemaCountDiviner),
    'Missing ArchiveSchemaCountDiviner',
  )
  app.archiveSchemaListDiviner = assertEx(
    dependencies.get<ArchiveSchemaListDiviner>(TYPES.ArchiveSchemaListDiviner),
    'Missing ArchiveSchemaListDiviner',
  )
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
