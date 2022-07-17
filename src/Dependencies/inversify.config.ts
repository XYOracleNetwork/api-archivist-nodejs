import 'reflect-metadata'

import { getDefaultLogger, Logger } from '@xylabs/sdk-api-express-ecs'
import { assertEx } from '@xylabs/sdk-js'
import { XyoAccount } from '@xyo-network/account'
import { XyoArchive } from '@xyo-network/sdk-xyo-client-js'
import { BaseMongoSdk } from '@xyo-network/sdk-xyo-mongo-js'
import { config } from 'dotenv'
import { Container } from 'inversify'

import { getBaseMongoSdk } from '../lib'
import {
  AdminApiKeyStrategy,
  AllowUnauthenticatedStrategy,
  ArchiveAccessControlStrategy,
  ArchiveAccountStrategy,
  ArchiveApiKeyStrategy,
  ArchiveArchivist,
  ArchiveOwnerStrategy,
  BcryptPasswordHasher,
  EntityArchive,
  JwtStrategy,
  LocalStrategy,
  MongoDBArchiveArchivist,
  MongoDBArchivePermissionsPayloadPayloadArchivist,
  MongoDBArchivistWitnessedPayloadArchivist,
  MongoDBUserArchivist,
  MongoDBUserManager,
  PasswordHasher,
  QueryConverterRegistry,
  QueryProcessorRegistry,
  SchemaToQueryProcessorRegistry,
  UserArchivist,
  UserManager,
  Web3AuthStrategy,
  WitnessedPayloadArchivist,
  XyoPayloadToQueryConverterRegistry,
} from '../middleware'
import { ArchivePermissionsArchivist, Query, User } from '../model'
import { IdentifiableHuri, InMemoryQueue, Queue } from '../Queue'
import { TYPES } from './types'

config()
const container = new Container({ autoBindInjectable: true })
let configured = false
export const configure = () => {
  if (configured) return
  configured = true

  const phrase = assertEx(process.env.ACCOUNT_SEED, 'ACCOUNT_SEED ENV VAR required to create Archivist')
  const apiKey = assertEx(process.env.API_KEY, 'API_KEY ENV VAR required to create Archivist')
  const jwtSecret = assertEx(process.env.JWT_SECRET, 'JWT_SECRET ENV VAR required to create Archivist')
  container.bind<string>(TYPES.ApiKey).toConstantValue(apiKey)

  container.bind<Logger>(TYPES.Logger).toConstantValue(getDefaultLogger())

  container.bind<XyoAccount>(TYPES.XyoAccount).toConstantValue(new XyoAccount({ phrase }))
  container.bind<ArchivePermissionsArchivist>(TYPES.ArchivePermissionsArchivist).toService(MongoDBArchivePermissionsPayloadPayloadArchivist)
  container.bind<WitnessedPayloadArchivist>(TYPES.WitnessedPayloadArchivist).toService(MongoDBArchivistWitnessedPayloadArchivist)

  container.bind<MongoDBUserArchivist>(TYPES.UserArchivistMongoDb).to(MongoDBUserArchivist).inSingletonScope()
  container.bind<MongoDBUserManager>(TYPES.UserManagerMongoDb).to(MongoDBUserManager).inSingletonScope()
  container.bind<UserArchivist>(TYPES.UserArchivist).to(MongoDBUserArchivist).inSingletonScope()

  const passwordHasher = BcryptPasswordHasher
  container.bind<PasswordHasher<User>>(TYPES.PasswordHasher).toConstantValue(passwordHasher)
  container.bind<BaseMongoSdk<User>>(TYPES.UserSdkMongo).toConstantValue(getBaseMongoSdk<User>('users'))
  container.bind<UserManager>(TYPES.UserManager).to(MongoDBUserManager).inSingletonScope()

  container.bind<BaseMongoSdk<Required<XyoArchive>>>(TYPES.ArchiveSdkMongo).toConstantValue(getBaseMongoSdk<EntityArchive>('archives'))
  container.bind<MongoDBArchiveArchivist>(TYPES.ArchiveArchivistMongoDb).to(MongoDBArchiveArchivist)
  container.bind<ArchiveArchivist>(TYPES.ArchiveArchivist).to(MongoDBArchiveArchivist)

  container.bind<Queue<Query>>(TYPES.QueryQueue).toConstantValue(new InMemoryQueue<Query>())
  container.bind<Queue<IdentifiableHuri>>(TYPES.ResponseQueue).toConstantValue(new InMemoryQueue<IdentifiableHuri>())

  configureAuth(jwtSecret, passwordHasher)

  container.bind<QueryConverterRegistry>(TYPES.XyoPayloadToQueryConverterRegistry).toConstantValue(new XyoPayloadToQueryConverterRegistry())
  container.bind<QueryProcessorRegistry>(TYPES.SchemaToQueryProcessorRegistry).toConstantValue(new SchemaToQueryProcessorRegistry())
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
