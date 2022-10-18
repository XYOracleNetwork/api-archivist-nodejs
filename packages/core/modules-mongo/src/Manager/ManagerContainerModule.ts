import { UserManager } from '@xyo-network/archivist-model'
import { TYPES } from '@xyo-network/archivist-types'
import { ContainerModule, interfaces } from 'inversify'

import { MongoDBUserManager } from './User'

export const ManagerContainerModule = new ContainerModule((bind: interfaces.Bind) => {
  bind<UserManager>(TYPES.UserManager).to(MongoDBUserManager).inSingletonScope()
})
