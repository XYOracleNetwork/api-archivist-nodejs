export interface QueryableRepository<TResponse, TQuery> {
  find(query: TQuery): Promise<TResponse>
}
export interface ReadRepository<TResponse, TId = string> {
  get(id: TId): Promise<TResponse>
}

export interface WriteRepository<TResponse, TInsert> {
  insert(item: TInsert): Promise<TResponse>
}

export type Repository<TInsert, TResponse, TQuery, TId> = ReadRepository<TResponse, TId> & WriteRepository<TResponse, TInsert> & QueryableRepository<TResponse, TQuery>
