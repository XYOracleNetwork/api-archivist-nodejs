import 'reflect-metadata'

import { getDefaultLogger, Logger } from '@xylabs/sdk-api-express-ecs'
import { assertEx } from '@xylabs/sdk-js'
import { XyoAccount } from '@xyo-network/account'
import { BcryptPasswordHasher, PasswordHasher } from '@xyo-network/archivist-middleware'
import { User } from '@xyo-network/archivist-model'
import { addArchivist } from '@xyo-network/archivist-mongo'
import { TYPES } from '@xyo-network/archivist-types'
import { config } from 'dotenv'
import { Container } from 'inversify'

import { addAuth } from './addAuth'
import { addInMemoryQueueing } from './addInMemoryQueueing'
import { addPayloadHandlers } from './addPayloadHandlers'
import { addQueryConverterRegistry } from './addQueryConverterRegistry'
import { addQueryProcessorRegistry } from './addQueryProcessorRegistry'
config()
export const dependencies = new Container({
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
  dependencies.bind<PasswordHasher<User>>(TYPES.PasswordHasher).toConstantValue(passwordHasher)
  dependencies.bind<Logger>(TYPES.Logger).toConstantValue(getDefaultLogger())
  dependencies.bind<XyoAccount>(TYPES.Account).toConstantValue(new XyoAccount({ phrase }))

  addArchivist(dependencies)
  addAuth(dependencies)
  addPayloadHandlers(dependencies)
  addInMemoryQueueing(dependencies)
  addQueryConverterRegistry(dependencies)
  addQueryProcessorRegistry(dependencies)
}