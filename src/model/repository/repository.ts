export interface ReadOnlyRepository<T, TQuery, TId = string> {
  find(query: TQuery): Promise<T>
  get(id: TId): Promise<T>
}

export interface WriteOnlyRepository<TInsert, TResponse> {
  insert(item: TInsert): Promise<TResponse>
}

export type ReadWriteRepository<TInsert, TResponse, TQuery, TId> = ReadOnlyRepository<TResponse, TQuery, TId> & WriteOnlyRepository<TInsert, TResponse>
