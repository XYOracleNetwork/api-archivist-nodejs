import { UserManager } from '@xyo-network/archivist-model'
import { TYPES } from '@xyo-network/archivist-types'
import { Container } from 'inversify'

import { MongoDBUserManager } from './User'

export const addManagers = (container: Container) => {
  container.bind<UserManager>(TYPES.UserManager).to(MongoDBUserManager).inSingletonScope()
}
