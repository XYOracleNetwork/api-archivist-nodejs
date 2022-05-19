export interface QueryableRepository<TResponse, TQuery> {
  find(query: TQuery): Promise<TResponse>
}
export interface ReadRepository<TReadResponse, TId = string> {
  get(id: TId): Promise<TReadResponse>
}

export interface WriteRepository<TWriteResponse, TWrite> {
  insert(item: TWrite): Promise<TWriteResponse>
}

export type ReadWriteRepository<TWriteResponse, TWrite, TReadResponse = TWriteResponse, TId = string> = ReadRepository<TReadResponse, TId> & WriteRepository<TWriteResponse, TWrite>

export type Repository<TInsert, TResponse, TId = string, TQuery = unknown> = ReadRepository<TResponse, TId> &
  WriteRepository<TResponse, TInsert> &
  QueryableRepository<TResponse, TQuery>
