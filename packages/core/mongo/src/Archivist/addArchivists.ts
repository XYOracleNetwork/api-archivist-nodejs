import {
  ArchiveArchivist,
  ArchiveBoundWitnessesArchivist,
  ArchiveKeyArchivist,
  ArchivePayloadsArchivist,
  ArchivePermissionsArchivist,
  BoundWitnessesArchivist,
  PayloadsArchivist,
  UserArchivist,
  WitnessedPayloadArchivist,
} from '@xyo-network/archivist-model'
import { TYPES } from '@xyo-network/archivist-types'
import { Container } from 'inversify'

import { MongoDBArchiveArchivist } from './Archive'
import { MongoDBArchiveBoundWitnessesArchivist } from './ArchiveBoundWitnesses'
import { MongoDBArchiveKeyArchivist } from './ArchiveKey'
import { MongoDBArchivePayloadsArchivist } from './ArchivePayloads'
import { MongoDBArchivePermissionsPayloadPayloadArchivist } from './ArchivePermissions'
import { MongoDBBoundWitnessArchivist } from './BoundWitness'
import { MongoDBPayloadArchivist } from './Payload'
import { MongoDBUserArchivist } from './User'
import { MongoDBArchivistWitnessedPayloadArchivist } from './WitnessedPayload'

export const addArchivists = (container: Container) => {
  container.bind<ArchiveArchivist>(TYPES.ArchiveArchivist).to(MongoDBArchiveArchivist).inSingletonScope()
  container.bind<ArchivePayloadsArchivist>(TYPES.ArchivePayloadsArchivist).to(MongoDBArchivePayloadsArchivist).inSingletonScope()
  container.bind<ArchiveBoundWitnessesArchivist>(TYPES.ArchiveBoundWitnessesArchivist).to(MongoDBArchiveBoundWitnessesArchivist).inSingletonScope()
  container.bind<ArchiveKeyArchivist>(TYPES.ArchiveKeyArchivist).to(MongoDBArchiveKeyArchivist).inSingletonScope()
  container
    .bind<ArchivePermissionsArchivist>(TYPES.ArchivePermissionsArchivist)
    .to(MongoDBArchivePermissionsPayloadPayloadArchivist)
    .inSingletonScope()
  container.bind<BoundWitnessesArchivist>(TYPES.BoundWitnessesArchivist).to(MongoDBBoundWitnessArchivist).inSingletonScope()
  container.bind<PayloadsArchivist>(TYPES.PayloadsArchivist).to(MongoDBPayloadArchivist).inSingletonScope()
  container.bind<UserArchivist>(TYPES.UserArchivist).to(MongoDBUserArchivist).inSingletonScope()
  container.bind<WitnessedPayloadArchivist>(TYPES.WitnessedPayloadArchivist).to(MongoDBArchivistWitnessedPayloadArchivist).inSingletonScope()
}
