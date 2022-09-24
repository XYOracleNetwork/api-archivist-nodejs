import { Module } from '@xyo-network/module'

export const isModule = (x: Module | Partial<Module>): x is Module => {
  return x && x?.address && x?.queries ? true : false
}
