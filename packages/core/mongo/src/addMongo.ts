import { Container } from 'inversify'

import { ArchivistContainerModule, archivistFactories } from './Archivist'
import { diviners } from './Diviner'
import { jobQueue } from './JobQueue'
import { managers } from './Manager'
import { MongoSdkContainerModule } from './Mongo'

export const addMongo = (container: Container) => {
  container.load(MongoSdkContainerModule)
  container.load(ArchivistContainerModule)
  container.load(archivistFactories)
  container.load(diviners)
  container.load(managers)
  container.load(jobQueue)
}
