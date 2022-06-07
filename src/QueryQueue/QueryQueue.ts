import { XyoPayload } from '@xyo-network/sdk-xyo-client-js'

import { Transport } from './Transport'

export abstract class QueryQueue<T extends XyoPayload = XyoPayload> {
  constructor(protected readonly queue: Transport<T>) {}

  public readonly enqueue = (query: T) => {
    if (query._hash) {
      return this.queue.enqueue(query)
    }
    throw new Error('Error enqueuing query')
  }

  // TODO: Return something more rich like Result<T>
  // to allow communication of status like pending,
  // completed, or missing
  public readonly get = (hash: string) => {
    return this.queue.get(hash)
  }
}
