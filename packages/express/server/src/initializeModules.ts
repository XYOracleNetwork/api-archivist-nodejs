import { dependencies } from '@xyo-network/archivist-dependencies'
import { TYPES } from '@xyo-network/archivist-types'
import { XyoModule } from '@xyo-network/module'

export const initializeModules = async () => {
  const modules: XyoModule[] = dependencies.getAll(TYPES.Module)
  const initializables = modules.map((mod) => mod.start())
  await Promise.all(initializables)
}
