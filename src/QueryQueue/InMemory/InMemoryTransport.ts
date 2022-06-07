import { Query } from '../../model'
import { Transport } from '../Transport'

// TODO: Use LRU cache
export class InMemoryTransport<T extends Query> implements Transport<T> {
  protected queue: Record<string, T | undefined | null> = {}

  public enqueue(query: T): Promise<string> {
    const id = query.id()
    this.queue[id] = query
    return Promise.resolve(id)
  }

  public get(hash: string): Promise<T | undefined | null> {
    const value = this.queue[hash]
    if (value) {
      this.queue[hash] = null
    }
    return Promise.resolve(value)
  }
}
