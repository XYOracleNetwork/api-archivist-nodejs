import { TYPES } from '@xyo-network/archivist-types'
import { Container } from 'inversify'

import { addMongo } from '../addMongo'
import { MongoDBUserManager } from '../Manager'
import { MongoDBArchiveArchivist } from './Archive'
import { MongoDBUserArchivist } from './User'

export const addMongoArchivist = (container: Container) => {
  addMongo(container)
  container.bind<MongoDBUserArchivist>(TYPES.UserArchivistMongoDb).to(MongoDBUserArchivist).inSingletonScope()
  container.bind<MongoDBUserManager>(TYPES.UserManagerMongoDb).to(MongoDBUserManager).inSingletonScope()
  container.bind<MongoDBArchiveArchivist>(TYPES.ArchiveArchivistMongoDb).to(MongoDBArchiveArchivist).inSingletonScope()
}
