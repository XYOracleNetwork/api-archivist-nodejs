import LruCache from 'lru-cache'
import Module from 'module'

// TODO: Modules shouldn't age out
/**
 * The number of registered modules to keep
 * in the cache
 */
const max = 10000

export class InMemoryModuleRegistry {
  protected registry = new LruCache<string, Module>({ max })

  /**
   *
   * @param address The address for the module
   * @returns The module at the address
   */
  public getModule(address: string): Promise<Module | undefined> {
    const module = this.registry.get(address)
    return Promise.resolve(module)
  }

  /**
   * onModuleAdded
   * Called each time a module is added to the node
   */
  public onModuleAdded(address: string, module: Module) {
    this.registry.set(address, module)
  }
}
