import { Module } from '@xyo-network/module'

export const isModule = (x: Module<never> | Partial<Module<never>>): x is Module<never> => {
  return x && x?.address && x?.queries ? true : false
}
