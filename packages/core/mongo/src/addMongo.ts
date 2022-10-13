import { Container } from 'inversify'

import { addArchivistFactories, addArchivists, addMongoArchivists } from './Archivist'
import { addDiviners } from './Diviner'
import { addInitializables } from './Initializable'
import { addJobQueue } from './JobQueue'
import { addManagers } from './Manager'
import { addMongoSdks } from './Mongo'

// TODO: Move from the addX pattern to using Container Modules
// https://github.com/inversify/InversifyJS/blob/master/wiki/container_modules.md
export const addMongo = async (container: Container) => {
  addMongoSdks(container)
  addMongoArchivists(container)
  addArchivists(container)
  addArchivistFactories(container)
  addDiviners(container)
  addManagers(container)
  await addJobQueue(container)
  addInitializables(container)
}
