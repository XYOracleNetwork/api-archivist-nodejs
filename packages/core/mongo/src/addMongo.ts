import { Container } from 'inversify'

import { addArchivists, addMongoArchivists } from './Archivist'
import { addDiviners } from './Diviner'
import { addMongoSdks } from './Mongo'

export const addMongo = (container: Container) => {
  addMongoSdks(container)
  addMongoArchivists(container)
  addArchivists(container)
  addDiviners(container)
}
