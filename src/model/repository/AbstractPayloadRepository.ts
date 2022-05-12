import { Repository } from './Repository'
import { XyoStoredPayload } from './XyoStoredPayload'

export abstract class AbstractPayloadRepository<TInsert, TResponse extends XyoStoredPayload<TInsert>, TQuery, TId, TSchema extends string = string>
  implements Repository<TInsert[], TResponse[], TQuery, TId>
{
  abstract find(filter: TQuery): Promise<TResponse[]>
  abstract get(id: TId): Promise<TResponse[]>
  abstract insert(items: TInsert[]): Promise<TResponse[]>
}
