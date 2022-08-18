import { Container } from 'inversify'

import { MONGO_TYPES } from '../types'
import { MongoDBArchiveArchivist } from './Archive'
import { MongoDBUserArchivist } from './User'

export const addMongoArchivists = (container: Container) => {
  container.bind<MongoDBUserArchivist>(MONGO_TYPES.UserArchivistMongoDb).to(MongoDBUserArchivist).inSingletonScope()
  container.bind<MongoDBArchiveArchivist>(MONGO_TYPES.ArchiveArchivistMongoDb).to(MongoDBArchiveArchivist).inSingletonScope()
}
