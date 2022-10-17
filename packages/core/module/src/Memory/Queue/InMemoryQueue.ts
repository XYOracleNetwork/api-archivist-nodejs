import { Identifiable } from '@xyo-network/archivist-model'
import { Queue } from '@xyo-network/archivist-model/src/Queue'
import { Transport } from '@xyo-network/archivist-model/src/Transport/Transport'

import { InMemoryTransport } from '../Transport/InMemoryTransport'

export class InMemoryQueue<T extends Identifiable> extends Queue<T> {
  constructor(protected transport: Transport<T> = new InMemoryTransport<T>()) {
    super(transport)
  }
}
