import { XyoPayload } from '@xyo-network/sdk-xyo-client-js'

import { QueryQueue } from '../QueryQueue'
import { Transport } from '../Transport'
import { InMemoryTransport } from './InMemoryTransport'

export class InMemoryQueryQueue<T extends XyoPayload = XyoPayload> extends QueryQueue {
  protected queue: Transport<T> = new InMemoryTransport<T>()
  constructor() {
    super()
  }
}
