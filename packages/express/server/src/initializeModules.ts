import { dependencies } from '@xyo-network/archivist-dependencies'
import { TYPES } from '@xyo-network/archivist-types'
import { XyoModule } from '@xyo-network/module'

export const initializeModules = async () => {
  const modules: XyoModule[] = dependencies.get(TYPES.Initializable)
  // TODO: Initialize via Query once SDK updates happen
  // const query: XyoModuleInitializeQuery = {
  //   schema: XyoModuleInitializeQuerySchema,
  // }
  const initializables = modules.map((mod) => {
    // return mod.query(query)
    return mod.initialize()
  })

  await Promise.all(initializables)
}
