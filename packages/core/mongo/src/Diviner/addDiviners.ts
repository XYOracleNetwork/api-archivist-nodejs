import { ArchiveSchemaCountDiviner, ArchiveSchemaListDiviner } from '@xyo-network/archivist-model'
import { TYPES } from '@xyo-network/archivist-types'
import { Container } from 'inversify'

import { MongoDBArchiveSchemaCountDiviner } from './ArchiveSchemaCount'
import { MongoDBArchiveSchemaListDiviner } from './ArchiveSchemaList'

export const addDiviners = (container: Container) => {
  container.bind<ArchiveSchemaCountDiviner>(TYPES.ArchiveSchemaCountDiviner).to(MongoDBArchiveSchemaCountDiviner).inSingletonScope()
  container.bind<ArchiveSchemaListDiviner>(TYPES.ArchiveSchemaListDiviner).to(MongoDBArchiveSchemaListDiviner).inSingletonScope()
}
