import {
  ArchiveArchivist,
  ArchiveKeyArchivist,
  ArchivePermissionsArchivist,
  UserArchivist,
  UserManager,
  WitnessedPayloadArchivist,
} from '@xyo-network/archivist-model'
import { TYPES } from '@xyo-network/archivist-types'
import { Container } from 'inversify'

import { MongoDBUserManager } from '../Manager'
import { MongoDBArchiveArchivist } from './Archive'
import { MongoDBArchiveKeyArchivist } from './ArchiveKey'
import { MongoDBArchivePermissionsPayloadPayloadArchivist } from './ArchivePermissions'
import { MongoDBUserArchivist } from './User'
import { MongoDBArchivistWitnessedPayloadArchivist } from './WitnessedPayload'

export const addArchivists = (container: Container) => {
  container.bind<ArchiveArchivist>(TYPES.ArchiveArchivist).to(MongoDBArchiveArchivist).inSingletonScope()
  container.bind<ArchiveKeyArchivist>(TYPES.ArchiveKeyArchivist).to(MongoDBArchiveKeyArchivist).inSingletonScope()
  container
    .bind<ArchivePermissionsArchivist>(TYPES.ArchivePermissionsArchivist)
    .to(MongoDBArchivePermissionsPayloadPayloadArchivist)
    .inSingletonScope()
  container.bind<UserArchivist>(TYPES.UserArchivist).to(MongoDBUserArchivist).inSingletonScope()
  container.bind<UserManager>(TYPES.UserManager).to(MongoDBUserManager).inSingletonScope()
  container.bind<WitnessedPayloadArchivist>(TYPES.WitnessedPayloadArchivist).to(MongoDBArchivistWitnessedPayloadArchivist).inSingletonScope()
}
