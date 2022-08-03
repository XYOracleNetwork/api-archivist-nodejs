import { MongoDBArchiveArchivist, MongoDBUserArchivist, MongoDBUserManager } from '@xyo-network/archivist-middleware'
import { TYPES } from '@xyo-network/archivist-types'
import { Container } from 'inversify'

import { addMongoSdks } from './addMongoSdks'

export const addMongoArchivist = (container: Container) => {
  addMongoSdks(container)
  container.bind<MongoDBUserArchivist>(TYPES.UserArchivistMongoDb).to(MongoDBUserArchivist).inSingletonScope()
  container.bind<MongoDBUserManager>(TYPES.UserManagerMongoDb).to(MongoDBUserManager).inSingletonScope()
  container.bind<MongoDBArchiveArchivist>(TYPES.ArchiveArchivistMongoDb).to(MongoDBArchiveArchivist).inSingletonScope()
}
