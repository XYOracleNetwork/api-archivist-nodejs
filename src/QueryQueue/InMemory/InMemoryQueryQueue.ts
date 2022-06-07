import { Query } from '../../model'
import { QueryQueue } from '../QueryQueue'
import { Transport } from '../Transport'
import { InMemoryTransport } from './InMemoryTransport'

export class InMemoryQueryQueue<T extends Query> extends QueryQueue<T> {
  constructor(protected queue: Transport<T> = new InMemoryTransport<T>()) {
    super(queue)
  }
}
