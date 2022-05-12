export interface QueryableRepository<TResponse, TQuery> {
  find(query: TQuery): Promise<TResponse>
}
export interface ReadRepository<TResponse, TId = string> {
  get(id: TId): Promise<TResponse>
}

export interface WriteRepository<TResponse, TInsert> {
  insert(item: TInsert): Promise<TResponse>
}

export type ReadWriteRepository<TInsert, TResponse, TId = string> = ReadRepository<TResponse, TId> & WriteRepository<TResponse, TInsert>

export type Repository<TInsert, TResponse, TId = string, TQuery = unknown> = ReadRepository<TResponse, TId> &
  WriteRepository<TResponse, TInsert> &
  QueryableRepository<TResponse, TQuery>
