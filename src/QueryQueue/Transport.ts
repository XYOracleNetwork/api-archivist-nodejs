export type Transport<T> = {
  enqueue(query: T): Promise<string>
  get(hash: string): Promise<T | undefined>
}
