import { Query } from '@xyo-network/archivist-model'
import { IdentifiableHuri, InMemoryQueue, Queue } from '@xyo-network/archivist-queue'
import { TYPES } from '@xyo-network/archivist-types'
import { Container } from 'inversify'

export const addInMemoryQueueing = (container: Container) => {
  container.bind<Queue<Query>>(TYPES.QueryQueue).toConstantValue(new InMemoryQueue<Query>())
  container.bind<Queue<IdentifiableHuri>>(TYPES.ResponseQueue).toConstantValue(new InMemoryQueue<IdentifiableHuri>())
}
