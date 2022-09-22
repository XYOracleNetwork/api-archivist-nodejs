import { Module } from '@xyo-network/module'

import { ModuleDescription } from './ModuleDescription'

export const getModuleDescription = (module: Module<never>): ModuleDescription => {
  const { address, queries: getQueries } = module
  const queries = getQueries()
  return { address, queries }
}
