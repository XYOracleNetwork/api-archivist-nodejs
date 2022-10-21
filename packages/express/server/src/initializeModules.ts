import { dependencies } from '@xyo-network/archivist-dependencies'
import { Initializable } from '@xyo-network/archivist-model'
import { TYPES } from '@xyo-network/archivist-types'

export const initializeModules = async () => {
  const initializables: Initializable[] = dependencies.getAll(TYPES.Initializable)
  const initializations = initializables.map((mod) => mod.initialize())
  await Promise.all(initializations)
}
