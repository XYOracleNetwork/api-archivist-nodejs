import { Module } from '@xyo-network/module'

export interface ModuleRegistry {
  onModuleAdded?: (address: string, module: Module) => Promise<void>

  /**
   * Called to add a module to the registry
   */
  addModule(address: string, module: Module): Promise<void>
  /**
   * Retrieves a module that's been added to the registry
   * @param address The address for the module
   * @returns The module at the address or undefined if no module
   * exists at that address
   */
  getModule(address: string): Promise<Module | undefined>
}
