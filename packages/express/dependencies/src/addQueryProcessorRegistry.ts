import { QueryProcessorRegistry, SchemaToQueryProcessorRegistry } from '@xyo-network/archivist-middleware'
import { TYPES } from '@xyo-network/archivist-types'
import { Container } from 'inversify'

export const addQueryProcessorRegistry = (container: Container) => {
  container.bind<QueryProcessorRegistry>(TYPES.SchemaToQueryProcessorRegistry).toConstantValue(new SchemaToQueryProcessorRegistry())
}
