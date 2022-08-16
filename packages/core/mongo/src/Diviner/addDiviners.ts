import { ArchiveSchemaCountDiviner } from '@xyo-network/archivist-model'
import { TYPES } from '@xyo-network/archivist-types'
import { Container } from 'inversify'

import { MongoDBArchiveSchemaCountDiviner } from './ArchiveSchemaCount'

export const addDiviners = (container: Container) => {
  container.bind<ArchiveSchemaCountDiviner>(TYPES.ArchiveSchemaCountDiviner).to(MongoDBArchiveSchemaCountDiviner).inSingletonScope()
}
