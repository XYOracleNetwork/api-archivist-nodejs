import { Query } from '../../model'
import { Transport } from '../Transport'

// TODO: Use LRU cache
export class InMemoryTransport<T extends Query> implements Transport<T> {
  protected queue: Record<string, T> = {}

  public enqueue(query: T): Promise<string> {
    const id = query.id()
    this.queue[id] = query
    return Promise.resolve(id)
  }

  public get(hash: string): Promise<T> {
    return Promise.resolve(this.queue[hash])
  }
}
