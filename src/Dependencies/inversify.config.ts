import 'reflect-metadata'

import { getDefaultLogger, Logger } from '@xylabs/sdk-api-express-ecs'
import { assertEx } from '@xylabs/sdk-js'
import { XyoAccount } from '@xyo-network/account'
import { XyoArchive, XyoBoundWitnessWithMeta, XyoPayloadWithMeta } from '@xyo-network/sdk-xyo-client-js'
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
const container = new Container({
  autoBindInjectable: true,
  // Set to true to prevent warning when child constructor has less
  // parameters than the parent
  // "The number of constructor arguments in the derived
  // class <ClassName> must be >= than the number of constructor
  // arguments of its base class."
  // See:
  // https://github.com/inversify/InversifyJS/issues/522#issuecomment-682246076
  skipBaseClassChecks: true,
})
let configured = false
export const configure = () => {
  if (configured) return
  configured = true

  const phrase = assertEx(process.env.ACCOUNT_SEED, 'ACCOUNT_SEED ENV VAR required to create Archivist')
  const apiKey = assertEx(process.env.API_KEY, 'API_KEY ENV VAR required to create Archivist')
  const jwtSecret = assertEx(process.env.JWT_SECRET, 'JWT_SECRET ENV VAR required to create Archivist')
  const passwordHasher = BcryptPasswordHasher

  container.bind<string>(TYPES.ApiKey).toConstantValue(apiKey)
  container.bind<string>(TYPES.JwtSecret).toConstantValue(jwtSecret)

  container.bind<Logger>(TYPES.Logger).toConstantValue(getDefaultLogger())
  container.bind<XyoAccount>(TYPES.Account).toConstantValue(new XyoAccount({ phrase }))

  configureMongo()

  container.bind<ArchiveArchivist>(TYPES.ArchiveArchivist).to(MongoDBArchiveArchivist).inSingletonScope()
  container.bind<ArchivePermissionsArchivist>(TYPES.ArchivePermissionsArchivist).to(MongoDBArchivePermissionsPayloadPayloadArchivist).inSingletonScope()
  container.bind<PasswordHasher<User>>(TYPES.PasswordHasher).toConstantValue(passwordHasher)
  container.bind<UserArchivist>(TYPES.UserArchivist).to(MongoDBUserArchivist).inSingletonScope()
  container.bind<UserManager>(TYPES.UserManager).to(MongoDBUserManager).inSingletonScope()
  container.bind<WitnessedPayloadArchivist>(TYPES.WitnessedPayloadArchivist).to(MongoDBArchivistWitnessedPayloadArchivist).inSingletonScope()

  configureAuth()

  container.bind<Queue<Query>>(TYPES.QueryQueue).toConstantValue(new InMemoryQueue<Query>())
  container.bind<Queue<IdentifiableHuri>>(TYPES.ResponseQueue).toConstantValue(new InMemoryQueue<IdentifiableHuri>())
  container.bind<QueryConverterRegistry>(TYPES.PayloadToQueryConverterRegistry).toConstantValue(new XyoPayloadToQueryConverterRegistry())
  container.bind<QueryProcessorRegistry>(TYPES.SchemaToQueryProcessorRegistry).toConstantValue(new SchemaToQueryProcessorRegistry())
}

const configureMongo = () => {
  // SDKs
  container.bind<BaseMongoSdk<Required<XyoArchive>>>(TYPES.ArchiveSdkMongo).toConstantValue(getBaseMongoSdk<EntityArchive>('archives'))
  container.bind<BaseMongoSdk<XyoPayloadWithMeta>>(TYPES.PayloadSdkMongo).toConstantValue(getBaseMongoSdk<XyoPayloadWithMeta>('payloads'))
  container.bind<BaseMongoSdk<XyoBoundWitnessWithMeta>>(TYPES.BoundWitnessSdkMongo).toConstantValue(getBaseMongoSdk<XyoBoundWitnessWithMeta>('bound_witnesses'))
  container.bind<BaseMongoSdk<User>>(TYPES.UserSdkMongo).toConstantValue(getBaseMongoSdk<User>('users'))

  // Archivists
  container.bind<MongoDBUserArchivist>(TYPES.UserArchivistMongoDb).to(MongoDBUserArchivist).inSingletonScope()
  container.bind<MongoDBUserManager>(TYPES.UserManagerMongoDb).to(MongoDBUserManager).inSingletonScope()
  container.bind<MongoDBArchiveArchivist>(TYPES.ArchiveArchivistMongoDb).to(MongoDBArchiveArchivist).inSingletonScope()
}

const configureAuth = () => {
  container.bind(AdminApiKeyStrategy).to(AdminApiKeyStrategy).inSingletonScope()
  container.bind(AllowUnauthenticatedStrategy).toConstantValue(new AllowUnauthenticatedStrategy())
  container.bind(ArchiveAccessControlStrategy).toConstantValue(new ArchiveAccessControlStrategy())
  container.bind(ArchiveAccountStrategy).toConstantValue(new ArchiveAccountStrategy())
  container.bind(ArchiveApiKeyStrategy).to(ArchiveApiKeyStrategy).inSingletonScope()
  container.bind(ArchiveOwnerStrategy).toConstantValue(new ArchiveOwnerStrategy())
  container.bind(JwtStrategy).to(JwtStrategy).inSingletonScope()
  container.bind(LocalStrategy).to(LocalStrategy).inSingletonScope()
  container.bind(Web3AuthStrategy).to(Web3AuthStrategy).inSingletonScope()
}

// eslint-disable-next-line import/no-default-export
export default container
