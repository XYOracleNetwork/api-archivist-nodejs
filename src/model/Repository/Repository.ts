export interface QueryableRepository<TQueryResponse, TQuery> {
  find(query: TQuery): Promise<TQueryResponse>
}
export interface ReadRepository<TReadResponse, TId = string> {
  get(id: TId): Promise<TReadResponse>
}

export interface WriteRepository<TWriteResponse, TWrite> {
  insert(item: TWrite): Promise<TWriteResponse>
}

export type ReadWriteRepository<TWriteResponse, TWrite, TReadResponse = TWriteResponse, TId = string> = ReadRepository<TReadResponse, TId> & WriteRepository<TWriteResponse, TWrite>

export type Repository<TWriteResponse, TWrite, TReadResponse = TWriteResponse, TId = string, TQueryResponse = unknown, TQuery = unknown> = ReadWriteRepository<
  TWriteResponse,
  TWrite,
  TReadResponse,
  TId
> &
  QueryableRepository<TQueryResponse, TQuery>
