import { Handler } from '../Domain'
import { Query } from './Query'

export interface QueryHandler<T extends Query, R> extends Handler<T, R> {
  handle(command: T): Promise<R>
}
