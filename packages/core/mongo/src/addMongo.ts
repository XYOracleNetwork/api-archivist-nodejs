import { Container } from 'inversify'

import { archivistFactories, archivists } from './Archivist'
import { diviners } from './Diviner'
import { initializables } from './Initializable'
import { jobQueue } from './JobQueue'
import { managers } from './Manager'
import { mongoSdks } from './Mongo'

// TODO: Move from the addX pattern to using Container Modules
// https://github.com/inversify/InversifyJS/blob/master/wiki/container_modules.md
export const addMongo = (container: Container) => {
  container.load(mongoSdks)
  container.load(archivists)
  container.load(archivistFactories)
  container.load(diviners)
  container.load(managers)
  container.load(jobQueue)
  container.load(initializables)
}
