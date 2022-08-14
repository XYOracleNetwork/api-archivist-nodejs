import { SchemaCountDiviner } from '@xyo-network/archivist-model'
import { TYPES } from '@xyo-network/archivist-types'
import { Container } from 'inversify'

import { MongoDBSchemaCountDiviner } from './SchemaCount'

export const addDiviners = (container: Container) => {
  container.bind<SchemaCountDiviner>(TYPES.SchemaCountDiviner).to(MongoDBSchemaCountDiviner).inSingletonScope()
}
