import { ModuleRegistry } from '@xyo-network/archivist-model'
import { InMemoryModuleRegistry } from '@xyo-network/archivist-modules-memory'
import { TYPES } from '@xyo-network/archivist-types'
import { Container } from 'inversify'

export const addInMemoryModuleRegistry = (container: Container) => {
  container.bind<ModuleRegistry>(TYPES.ModuleRegistry).toConstantValue(new InMemoryModuleRegistry())
}
