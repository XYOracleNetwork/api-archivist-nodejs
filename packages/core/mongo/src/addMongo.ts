import { Container } from 'inversify'

import { addArchivists, addMongoArchivists } from './Archivist'
import { addDiviners } from './Diviner'
import { addJobQueue } from './JobQueue'
import { addManagers } from './Manager'
import { addMongoSdks } from './Mongo'

export const addMongo = async (container: Container) => {
  addMongoSdks(container)
  addMongoArchivists(container)
  addArchivists(container)
  addDiviners(container)
  addManagers(container)
  await addJobQueue(container)
}
