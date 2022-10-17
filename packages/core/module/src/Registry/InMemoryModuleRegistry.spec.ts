import { ModuleRegistry } from '@xyo-network/archivist-model'
import { Logger } from '@xyo-network/shared'
import { mock, MockProxy } from 'jest-mock-extended'

import { InMemoryModuleRegistry } from './InMemoryModuleRegistry'

describe('MongoDBElevationDiviner', () => {
  let logger: MockProxy<Logger>
  let sut: ModuleRegistry
  beforeEach(() => {
    logger = mock<Logger>()
    sut = new InMemoryModuleRegistry()
  })
  describe('InMemoryModuleRegistry', () => {
    describe('addModule', () => {
      it('adds modules', async () => {
        // TODO:
      })
    })
    describe('getModule', () => {
      it('gets modules that have been added', async () => {
        // TODO:
      })
      it('returns undefined for modules that have not been added', async () => {
        // TODO:
      })
    })
    describe('onModuleAdded', () => {
      it('is called when modules are added', async () => {
        // TODO:
      })
    })
  })
})
