import { Query } from '@xyo-network/archivist-model'

import { IdentifiableHuri } from './IdentifiableHuri'
import { Queue } from './Queue'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Application {
      queryQueue: Queue<Query>
      responseQueue: Queue<IdentifiableHuri>
    }
  }
}

export * from './IdentifiableHuri'
export * from './InMemory'
export * from './Queue'
