import 'reflect-metadata'

import { getDefaultLogger, Logger } from '@xylabs/sdk-api-express-ecs'
import { assertEx } from '@xylabs/sdk-js'
import { XyoAccount } from '@xyo-network/account'
import { XyoArchive, XyoBoundWitnessWithMeta, XyoPayloadWithMeta } from '@xyo-network/sdk-xyo-client-js'
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
} from './middleware'
import { ArchivePermissionsArchivist, Query, User } from './model'
import { DebugQueryHandler, GetArchivePermissionsQueryHandler, GetDomainConfigQueryHandler, GetSchemaQueryHandler, SetArchivePermissionsQueryHandler } from './QueryHandlers'
import { IdentifiableHuri, InMemoryQueue, Queue } from './Queue'
import { TYPES } from './types'
config()
const dependencies = new Container({
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

  dependencies.bind<string>(TYPES.ApiKey).toConstantValue(apiKey)
  dependencies.bind<string>(TYPES.JwtSecret).toConstantValue(jwtSecret)

  dependencies.bind<Logger>(TYPES.Logger).toConstantValue(getDefaultLogger())
  dependencies.bind<XyoAccount>(TYPES.Account).toConstantValue(new XyoAccount({ phrase }))

  configureMongo(dependencies)

  dependencies.bind<ArchiveArchivist>(TYPES.ArchiveArchivist).to(MongoDBArchiveArchivist).inSingletonScope()
  dependencies.bind<ArchivePermissionsArchivist>(TYPES.ArchivePermissionsArchivist).to(MongoDBArchivePermissionsPayloadPayloadArchivist).inSingletonScope()
  dependencies.bind<PasswordHasher<User>>(TYPES.PasswordHasher).toConstantValue(passwordHasher)
  dependencies.bind<UserArchivist>(TYPES.UserArchivist).to(MongoDBUserArchivist).inSingletonScope()
  dependencies.bind<UserManager>(TYPES.UserManager).to(MongoDBUserManager).inSingletonScope()
  dependencies.bind<WitnessedPayloadArchivist>(TYPES.WitnessedPayloadArchivist).to(MongoDBArchivistWitnessedPayloadArchivist).inSingletonScope()

  configureAuth(dependencies)

  configureQueryProcessors(dependencies)

  dependencies.bind<Queue<Query>>(TYPES.QueryQueue).toConstantValue(new InMemoryQueue<Query>())
  dependencies.bind<Queue<IdentifiableHuri>>(TYPES.ResponseQueue).toConstantValue(new InMemoryQueue<IdentifiableHuri>())
  dependencies.bind<QueryConverterRegistry>(TYPES.PayloadToQueryConverterRegistry).toConstantValue(new XyoPayloadToQueryConverterRegistry())
  dependencies.bind<QueryProcessorRegistry>(TYPES.SchemaToQueryProcessorRegistry).toConstantValue(new SchemaToQueryProcessorRegistry())
}

export const configureMongo = (container: Container) => {
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

export const configureAuth = (container: Container) => {
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

export const configureQueryProcessors = (container: Container) => {
  container.bind(DebugQueryHandler).to(DebugQueryHandler).inTransientScope()
  container.bind(SetArchivePermissionsQueryHandler).to(SetArchivePermissionsQueryHandler).inTransientScope()
  container.bind(GetArchivePermissionsQueryHandler).to(GetArchivePermissionsQueryHandler).inTransientScope()
  container.bind(GetDomainConfigQueryHandler).to(GetDomainConfigQueryHandler).inTransientScope()
  container.bind(GetSchemaQueryHandler).to(GetSchemaQueryHandler).inTransientScope()
}

// eslint-disable-next-line import/no-default-export
export default dependencies
