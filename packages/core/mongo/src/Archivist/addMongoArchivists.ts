import { Container } from 'inversify'

import { MongoDBUserManager } from '../Manager'
import { MONGO_TYPES } from '../types'
import { MongoDBArchiveArchivist } from './Archive'
import { MongoDBUserArchivist } from './User'

export const addMongoArchivists = (container: Container) => {
  container.bind<MongoDBUserArchivist>(MONGO_TYPES.UserArchivistMongoDb).to(MongoDBUserArchivist).inSingletonScope()
  container.bind<MongoDBUserManager>(MONGO_TYPES.UserManagerMongoDb).to(MongoDBUserManager).inSingletonScope()
  container.bind<MongoDBArchiveArchivist>(MONGO_TYPES.ArchiveArchivistMongoDb).to(MongoDBArchiveArchivist).inSingletonScope()
}
