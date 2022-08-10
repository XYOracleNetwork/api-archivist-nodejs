import { ArchiveArchivist, ArchivePermissionsArchivist, UserArchivist, UserManager, WitnessedPayloadArchivist } from '@xyo-network/archivist-model'
import { TYPES } from '@xyo-network/archivist-types'
import { Container } from 'inversify'

import { addMongoArchivist } from './addMongoArchivist'
import {
  MongoDBArchiveArchivist,
  MongoDBArchivePermissionsPayloadPayloadArchivist,
  MongoDBArchivistWitnessedPayloadArchivist,
  MongoDBUserArchivist,
} from './Archivist'
import { MongoDBUserManager } from './Manager'

export const addArchivist = (container: Container) => {
  addMongoArchivist(container)
  container.bind<ArchiveArchivist>(TYPES.ArchiveArchivist).to(MongoDBArchiveArchivist).inSingletonScope()
  container
    .bind<ArchivePermissionsArchivist>(TYPES.ArchivePermissionsArchivist)
    .to(MongoDBArchivePermissionsPayloadPayloadArchivist)
    .inSingletonScope()
  container.bind<UserArchivist>(TYPES.UserArchivist).to(MongoDBUserArchivist).inSingletonScope()
  container.bind<UserManager>(TYPES.UserManager).to(MongoDBUserManager).inSingletonScope()
  container.bind<WitnessedPayloadArchivist>(TYPES.WitnessedPayloadArchivist).to(MongoDBArchivistWitnessedPayloadArchivist).inSingletonScope()
}
