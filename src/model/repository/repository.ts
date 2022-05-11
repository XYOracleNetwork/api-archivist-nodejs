export interface ReadOnlyRepository<T, TQuery, TId = string> {
  find(query: TQuery): Promise<T[]>
  get(id: TId): Promise<T[]>
}

export interface WriteOnlyRepository<T> {
  insert(item: T): Promise<T>
}

export type ReadWriteRepository<T, TQuery, TId> = ReadOnlyRepository<T, TQuery, TId> & WriteOnlyRepository<T>
