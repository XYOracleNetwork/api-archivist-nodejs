import LruCache from 'lru-cache'
import Module from 'module'

// TODO: Modules shouldn't age out
/**
 * The number of registered modules to keep
 * in the cache
 */
const max = 10000

export class InMemoryModuleRegistry {
  public onModuleAdded?: (address: string, module: Module) => Promise<void>

  protected registry = new LruCache<string, Module>({ max })

  /**
   * Called to add a module to the registry
   */
  public async addModule(address: string, module: Module): Promise<void> {
    this.registry.set(address, module)
    if (this.onModuleAdded) {
      await this.onModuleAdded(address, module)
    }
  }

  /**
   * Retrieves a module that's been added to the registry
   * @param address The address for the module
   * @returns The module at the address or undefined if no module
   * exists at that address
   */
  public getModule(address: string): Promise<Module | undefined> {
    const module = this.registry.get(address)
    return Promise.resolve(module)
  }
}
