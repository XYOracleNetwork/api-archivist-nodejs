import { IdentifiableHuri, Query, Queue } from '@xyo-network/archivist-model'
import { InMemoryQueue } from '@xyo-network/archivist-module'
import { TYPES } from '@xyo-network/archivist-types'
import { Container } from 'inversify'

export const addInMemoryQueueing = (container: Container) => {
  container.bind<Queue<Query>>(TYPES.QueryQueue).toConstantValue(new InMemoryQueue<Query>())
  container.bind<Queue<IdentifiableHuri>>(TYPES.ResponseQueue).toConstantValue(new InMemoryQueue<IdentifiableHuri>())
}
