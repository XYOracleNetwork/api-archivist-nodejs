import 'reflect-metadata'

import { assertEx } from '@xylabs/sdk-js'
import { XyoAccount } from '@xyo-network/account'
import { XyoArchive } from '@xyo-network/sdk-xyo-client-js'
import { BaseMongoSdk } from '@xyo-network/sdk-xyo-mongo-js'
import { config } from 'dotenv'
import { Container } from 'inversify'

import { getBaseMongoSdk } from './lib'
import {
  ArchivistWitnessedPayloadRepository,
  BcryptPasswordHasher,
  EntityArchive,
  MongoDBArchivePermissionsPayloadPayloadRepository,
  MongoDBArchiveRepository,
  MongoDBArchivistWitnessedPayloadRepository,
  MongoDBUserManager,
  MongoDBUserRepository,
  PasswordHasher,
  UserManager,
  UserRepository,
} from './middleware'
import { ArchivePermissionsRepository, User } from './model'

config()

const phrase = assertEx(process.env.ACCOUNT_SEED, 'Seed phrase required to create Archivist XyoAccount')

const container = new Container({ autoBindInjectable: true })
container.bind(XyoAccount).toConstantValue(new XyoAccount({ phrase }))
container.bind<ArchivePermissionsRepository>('ArchivePermissionsRepository').to(MongoDBArchivePermissionsPayloadPayloadRepository)
container.bind<ArchivistWitnessedPayloadRepository>('ArchivistWitnessedPayloadRepository').to(MongoDBArchivistWitnessedPayloadRepository)

container.bind<MongoDBUserRepository>(MongoDBUserRepository).to(MongoDBUserRepository)
container.bind<MongoDBUserManager>(MongoDBUserManager).to(MongoDBUserManager)
container.bind<UserRepository>('UserRepository').to(MongoDBUserRepository)

container.bind<PasswordHasher<User>>('PasswordHasher<User>').toConstantValue(BcryptPasswordHasher)
container.bind<BaseMongoSdk<User>>(BaseMongoSdk<User>).toConstantValue(getBaseMongoSdk<User>('users'))
container.bind<UserManager>('UserManager').to(MongoDBUserManager)

container.bind<BaseMongoSdk<Required<XyoArchive>>>('BaseMongoSdk<Required<XyoArchive>>').toConstantValue(getBaseMongoSdk<EntityArchive>('archives'))
container.bind<MongoDBArchiveRepository>(MongoDBArchiveRepository).to(MongoDBArchiveRepository)

// eslint-disable-next-line import/no-default-export
export default container
