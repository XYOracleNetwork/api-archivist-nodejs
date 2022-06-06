import { XyoPayload } from '@xyo-network/sdk-xyo-client-js'

import { QueryQueue } from '../QueryQueue'
import { Transport } from '../Transport'
import { InMemoryTransport } from './InMemoryTransport'

export class InMemoryQueryQueue<T extends XyoPayload = XyoPayload> extends QueryQueue {
  constructor(protected queue: Transport<T> = new InMemoryTransport<T>()) {
    super(queue)
  }
}
