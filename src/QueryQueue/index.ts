import { QueryQueue } from './QueryQueue'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Application {
      queryQueue: QueryQueue
    }
  }
}

export * from './InMemory'
export * from './QueryQueue'
