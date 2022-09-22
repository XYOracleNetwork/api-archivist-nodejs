import { ModuleDescription } from '@xyo-network/archivist-model'
import { Module } from '@xyo-network/module'

export const getModuleDescription = (module: Module<never>): ModuleDescription => {
  const { address, queries: getQueries } = module
  const queries = getQueries()
  return { address, queries }
}
