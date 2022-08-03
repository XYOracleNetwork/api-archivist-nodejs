import { TYPES } from '@xyo-network/archivist-types'
import { Container } from 'inversify'

import { addMongoSdks } from './addMongoSdks'
import { MongoDBArchiveArchivist, MongoDBUserArchivist } from './Archivist'
import { MongoDBUserManager } from './Manager'

export const addMongoArchivist = (container: Container) => {
  addMongoSdks(container)
  container.bind<MongoDBUserArchivist>(TYPES.UserArchivistMongoDb).to(MongoDBUserArchivist).inSingletonScope()
  container.bind<MongoDBUserManager>(TYPES.UserManagerMongoDb).to(MongoDBUserManager).inSingletonScope()
  container.bind<MongoDBArchiveArchivist>(TYPES.ArchiveArchivistMongoDb).to(MongoDBArchiveArchivist).inSingletonScope()
}
