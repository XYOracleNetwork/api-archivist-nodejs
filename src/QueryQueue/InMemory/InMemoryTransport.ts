import { XyoPayload } from '@xyo-network/sdk-xyo-client-js'

import { Transport } from '../Transport'

// TODO: Use LRU cache
export class InMemoryTransport<T extends XyoPayload = XyoPayload> implements Transport<T> {
  protected queue: Record<string, T> = {}

  public enqueue(query: T): Promise<string> {
    const hash = query._hash
    if (hash) {
      this.queue[hash] = query
      return Promise.resolve(hash)
    }
    throw new Error('Attempted to queue query with no hash')
  }

  public get(hash: string): Promise<T> {
    return Promise.resolve(this.queue[hash])
  }
}
