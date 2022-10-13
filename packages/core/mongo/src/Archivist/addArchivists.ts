import {
  ArchiveArchivist,
  ArchiveKeyArchivist,
  BoundWitnessesArchivist,
  PayloadArchivist,
  UserArchivist,
  WitnessedPayloadArchivist,
} from '@xyo-network/archivist-model'
import { TYPES } from '@xyo-network/archivist-types'
import { Container, ContainerModule, interfaces } from 'inversify'

import { MONGO_TYPES } from '../types'
import { MongoDBArchiveArchivist } from './Archive'
import { MongoDBArchiveKeyArchivist } from './ArchiveKey'
import { MongoDBBoundWitnessArchivist } from './BoundWitness'
import { MongoDBPayloadArchivist } from './Payload'
import { MongoDBUserArchivist } from './User'
import { MongoDBArchivistWitnessedPayloadArchivist } from './WitnessedPayload'

export const addArchivists = (container: Container) => {
  container.bind<ArchiveArchivist>(TYPES.ArchiveArchivist).to(MongoDBArchiveArchivist).inSingletonScope()
  container.bind<ArchiveKeyArchivist>(TYPES.ArchiveKeyArchivist).to(MongoDBArchiveKeyArchivist).inSingletonScope()
  container.bind<BoundWitnessesArchivist>(TYPES.BoundWitnessArchivist).to(MongoDBBoundWitnessArchivist).inSingletonScope()
  container.bind<PayloadArchivist>(TYPES.PayloadArchivist).to(MongoDBPayloadArchivist).inSingletonScope()
  container.bind<UserArchivist>(TYPES.UserArchivist).to(MongoDBUserArchivist).inSingletonScope()
  container.bind<WitnessedPayloadArchivist>(TYPES.WitnessedPayloadArchivist).to(MongoDBArchivistWitnessedPayloadArchivist).inSingletonScope()
}

export const archivists = new ContainerModule((bind: interfaces.Bind, _unbind: interfaces.Unbind) => {
  bind(MongoDBUserArchivist).to(MongoDBUserArchivist).inSingletonScope()
  bind<MongoDBUserArchivist>(MONGO_TYPES.UserArchivistMongoDb).toService(MongoDBUserArchivist)
  bind<UserArchivist>(TYPES.UserArchivist).toService(MongoDBUserArchivist)

  bind(MongoDBArchiveArchivist).to(MongoDBArchiveArchivist).inSingletonScope()
  bind<MongoDBArchiveArchivist>(MONGO_TYPES.ArchiveArchivistMongoDb).toService(MongoDBArchiveArchivist)
  bind<ArchiveArchivist>(TYPES.ArchiveArchivist).toService(MongoDBArchiveArchivist)

  bind<ArchiveKeyArchivist>(TYPES.ArchiveKeyArchivist).to(MongoDBArchiveKeyArchivist).inSingletonScope()
  bind<BoundWitnessesArchivist>(TYPES.BoundWitnessArchivist).to(MongoDBBoundWitnessArchivist).inSingletonScope()
  bind<PayloadArchivist>(TYPES.PayloadArchivist).to(MongoDBPayloadArchivist).inSingletonScope()
  bind<WitnessedPayloadArchivist>(TYPES.WitnessedPayloadArchivist).to(MongoDBArchivistWitnessedPayloadArchivist).inSingletonScope()
})
