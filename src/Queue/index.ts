import { Query } from '../model'
import { Queue } from './Queue'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Application {
      queryQueue: Queue<Query>
      responseQueue: Queue<Query>
    }
  }
}

export * from './InMemory'
export * from './Queue'
