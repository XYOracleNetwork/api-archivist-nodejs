import { Container } from 'inversify'

import { archivistFactories, archivists } from './Archivist'
import { diviners } from './Diviner'
import { addInitializables } from './Initializable'
import { addJobQueue } from './JobQueue'
import { addManagers } from './Manager'
import { mongoSdks } from './Mongo'

// TODO: Move from the addX pattern to using Container Modules
// https://github.com/inversify/InversifyJS/blob/master/wiki/container_modules.md
export const addMongo = async (container: Container) => {
  container.load(mongoSdks)
  container.load(archivists)
  container.load(archivistFactories)
  container.load(diviners)
  addManagers(container)
  await addJobQueue(container)
  addInitializables(container)
}
