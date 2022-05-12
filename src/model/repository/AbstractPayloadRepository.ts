import { ReadWriteRepository } from './repository'

export abstract class AbstractPayloadRepository<TInsert, TResponse extends TInsert, TQuery, TId, TSchema extends string = string>
  implements ReadWriteRepository<TInsert[], TResponse[], TQuery, TId>
{
  abstract find(filter: TQuery): Promise<TResponse[]>
  abstract get(id: TId): Promise<TResponse[]>
  abstract insert(items: TInsert[]): Promise<TResponse[]>
}
