import 'reflect-metadata'

import { getDefaultLogger, Logger } from '@xylabs/sdk-api-express-ecs'
import { assertEx } from '@xylabs/sdk-js'
import { XyoAccount } from '@xyo-network/account'
import { XyoArchive } from '@xyo-network/sdk-xyo-client-js'
import { BaseMongoSdk } from '@xyo-network/sdk-xyo-mongo-js'
import { config } from 'dotenv'
import { Container } from 'inversify'

import { getBaseMongoSdk } from './lib'
import {
  AdminApiKeyStrategy,
  AllowUnauthenticatedStrategy,
  ArchiveAccessControlStrategy,
  ArchiveAccountStrategy,
  ArchiveApiKeyStrategy,
  ArchiveOwnerStrategy,
  ArchiveRepository,
  ArchivistWitnessedPayloadRepository,
  BcryptPasswordHasher,
  EntityArchive,
  JwtStrategy,
  LocalStrategy,
  MongoDBArchivePermissionsPayloadPayloadRepository,
  MongoDBArchiveRepository,
  MongoDBArchivistWitnessedPayloadRepository,
  MongoDBUserManager,
  MongoDBUserRepository,
  PasswordHasher,
  QueryConverterRegistry,
  QueryProcessorRegistry,
  SchemaToQueryProcessorRegistry,
  UserManager,
  UserRepository,
  Web3AuthStrategy,
  XyoPayloadToQueryConverterRegistry,
} from './middleware'
import { ArchivePermissionsRepository, Query, User } from './model'
import { IdentifiableHuri, InMemoryQueue, Queue } from './Queue'

config()
const container = new Container({ autoBindInjectable: true })
let configured = false
export const configure = () => {
  if (configured) return
  configured = true

  const phrase = assertEx(process.env.ACCOUNT_SEED, 'ACCOUNT_SEED ENV VAR required to create Archivist')
  const apiKey = assertEx(process.env.API_KEY, 'API_KEY ENV VAR required to create Archivist')
  const jwtSecret = assertEx(process.env.JWT_SECRET, 'JWT_SECRET ENV VAR required to create Archivist')
  container.bind<string>('ApiKey').toConstantValue(apiKey)

  container.bind<Logger>('Logger').toConstantValue(getDefaultLogger())

  container.bind(XyoAccount).toConstantValue(new XyoAccount({ phrase }))
  container.bind<ArchivePermissionsRepository>('ArchivePermissionsRepository').toService(MongoDBArchivePermissionsPayloadPayloadRepository)
  container.bind<ArchivistWitnessedPayloadRepository>('ArchivistWitnessedPayloadRepository').toService(MongoDBArchivistWitnessedPayloadRepository)

  container.bind<MongoDBUserRepository>(MongoDBUserRepository).to(MongoDBUserRepository).inSingletonScope()
  container.bind<MongoDBUserManager>(MongoDBUserManager).to(MongoDBUserManager).inSingletonScope()
  container.bind<UserRepository>('UserRepository').to(MongoDBUserRepository).inSingletonScope()

  const passwordHasher = BcryptPasswordHasher
  container.bind<PasswordHasher<User>>('PasswordHasher<User>').toConstantValue(passwordHasher)
  container.bind<BaseMongoSdk<User>>(BaseMongoSdk<User>).toConstantValue(getBaseMongoSdk<User>('users'))
  container.bind<UserManager>('UserManager').to(MongoDBUserManager).inSingletonScope()

  container.bind<BaseMongoSdk<Required<XyoArchive>>>('BaseMongoSdk<Required<XyoArchive>>').toConstantValue(getBaseMongoSdk<EntityArchive>('archives'))
  container.bind<MongoDBArchiveRepository>(MongoDBArchiveRepository).to(MongoDBArchiveRepository)
  container.bind<ArchiveRepository>('ArchiveRepository').to(MongoDBArchiveRepository)

  container.bind<Queue<Query>>('Queue<Query>').toConstantValue(new InMemoryQueue<Query>())
  container.bind<Queue<IdentifiableHuri>>('Queue<IdentifiableHuri>').toConstantValue(new InMemoryQueue<IdentifiableHuri>())

  configureAuth(jwtSecret, passwordHasher)

  container.bind<QueryConverterRegistry>('XyoPayloadToQueryConverterRegistry').toConstantValue(new XyoPayloadToQueryConverterRegistry())
  container.bind<QueryProcessorRegistry>('SchemaToQueryProcessorRegistry').toConstantValue(new SchemaToQueryProcessorRegistry())
}

const configureAuth = (jwtSecret: string, passwordHasher: PasswordHasher<User>) => {
  container.bind(AdminApiKeyStrategy).to(AdminApiKeyStrategy)
  container.bind(AllowUnauthenticatedStrategy).toConstantValue(new AllowUnauthenticatedStrategy())
  container.bind(ArchiveAccessControlStrategy).toConstantValue(new ArchiveAccessControlStrategy())
  container.bind(ArchiveAccountStrategy).toConstantValue(new ArchiveAccountStrategy())
  container.bind(ArchiveApiKeyStrategy).to(ArchiveApiKeyStrategy)
  container.bind(ArchiveOwnerStrategy).toConstantValue(new ArchiveOwnerStrategy())
  container.bind(JwtStrategy).toConstantValue(new JwtStrategy(jwtSecret))
  container.bind(LocalStrategy).toConstantValue(new LocalStrategy(passwordHasher))
  container.bind(Web3AuthStrategy).to(Web3AuthStrategy)
}

// eslint-disable-next-line import/no-default-export
export default container
