import { assertEx } from '@xylabs/assert'
import { dependencies } from '@xyo-network/archivist-dependencies'
import { SchemaToQueryProcessorRegistry, XyoPayloadToQueryConverterRegistry } from '@xyo-network/archivist-middleware'
import {
  ArchiveArchivist,
  ArchiveBoundWitnessArchivistFactory,
  ArchiveKeyArchivist,
  ArchivePayloadsArchivistFactory,
  ArchivePermissionsArchivist,
  BoundWitnessArchivist,
  BoundWitnessStatsDiviner,
  PayloadArchivist,
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
  app.archiveBoundWitnessArchivistFactory = assertEx(
    dependencies.get<ArchiveBoundWitnessArchivistFactory>(TYPES.ArchiveBoundWitnessArchivistFactory),
    'Missing ArchiveBoundWitnessArchivistFactory',
  )
  app.archivePayloadsArchivistFactory = assertEx(
    dependencies.get<ArchivePayloadsArchivistFactory>(TYPES.ArchivePayloadArchivistFactory),
    'Missing ArchivePayloadsArchivistFactory',
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
  app.boundWitnessArchivist = assertEx(dependencies.get<BoundWitnessArchivist>(TYPES.BoundWitnessArchivist), 'Missing BoundWitnessArchivist')
  app.payloadStatsDiviner = assertEx(dependencies.get<PayloadStatsDiviner>(TYPES.PayloadStatsDiviner), 'Missing PayloadStatsDiviner')
  app.payloadArchivist = assertEx(dependencies.get<PayloadArchivist>(TYPES.PayloadArchivist), 'Missing PayloadArchivist')
  app.queryConverters = assertEx(
    dependencies.get<XyoPayloadToQueryConverterRegistry>(TYPES.PayloadToQueryConverterRegistry),
    'Missing QueryConverters',
  )
  app.queryProcessors = assertEx(dependencies.get<SchemaToQueryProcessorRegistry>(TYPES.SchemaToQueryProcessorRegistry), 'Missing QueryProcessors')
  app.queryQueue = assertEx(dependencies.get<Queue<Query>>(TYPES.QueryQueue), 'Missing QueryQueue')
  app.responseQueue = assertEx(dependencies.get<Queue<IdentifiableHuri>>(TYPES.ResponseQueue), 'Missing ResponseQueue')
  app.userManager = assertEx(dependencies.get<UserManager>(TYPES.UserManager), 'Missing UserManager')
}
