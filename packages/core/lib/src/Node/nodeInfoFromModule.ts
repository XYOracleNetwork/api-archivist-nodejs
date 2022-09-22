import { NodeInfo } from '@xyo-network/archivist-model'
import { Module } from '@xyo-network/module'

export const nodeInfoFromModule = (module: Module<never>): NodeInfo => {
  const { address, queries: getQueries } = module
  const queries = getQueries()
  const url = `/${address}`
  return { address, queries, url }
}
