import { XyoPayload } from '@xyo-network/sdk-xyo-client-js'

import { Transport } from './Transport'

export abstract class QueryQueue<T extends XyoPayload = XyoPayload> {
  constructor(protected queue: Transport<T>) {}

  public async enqueue(query: T) {
    if (query._hash) {
      return await this.queue.enqueue(query)
    }
    throw new Error('Error enqueuing query')
  }

  public get(hash: string) {
    return this.queue.get(hash)
  }
}
