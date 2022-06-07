import { Identifiable } from '../../model'
import { Queue } from '../Queue'
import { Transport } from '../Transport'
import { InMemoryTransport } from './InMemoryTransport'

export class InMemoryQueue<T extends Identifiable> extends Queue<T> {
  constructor(protected queue: Transport<T> = new InMemoryTransport<T>()) {
    super(queue)
  }
}
