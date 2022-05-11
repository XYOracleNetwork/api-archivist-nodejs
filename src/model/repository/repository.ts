// TODO: make functional instead for non-id properties
export interface Entity<T = string> {
  id: T
}

// TODO: Read, Write, Add, Delete
export interface Repository<TEntity extends Entity<TId>, TId> {
  delete: (x: TEntity) => Promise<TEntity>
  deleteById: (id: TId) => Promise<TEntity>
  get: (predicate: unknown) => Promise<TEntity[]>
  getById: (id: TId) => Promise<TEntity | null>
}
