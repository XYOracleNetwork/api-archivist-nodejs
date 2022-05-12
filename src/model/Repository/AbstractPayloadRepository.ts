import { Repository } from './Repository'
import { XyoStoredPayload } from './XyoStoredPayload'

export abstract class AbstractPayloadRepository<TInsert, TResponse extends XyoStoredPayload<TInsert>, TId, TQuery> implements Repository<TInsert[], TResponse[], TId, TQuery> {
  abstract find(filter: TQuery): Promise<TResponse[]>
  abstract get(id: TId): Promise<TResponse[]>
  abstract insert(items: TInsert[]): Promise<TResponse[]>
}
