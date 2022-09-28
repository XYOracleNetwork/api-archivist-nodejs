import { ARCHIVIST_TYPES } from './archivist'
import { DIVINER_TYPES } from './diviner'
import { MODULE_TYPES } from './module'

export const TYPES = {
  ...ARCHIVIST_TYPES,
  ...DIVINER_TYPES,
  ...MODULE_TYPES,
  Account: Symbol('Account'),
  ApiKey: Symbol('ApiKey'),
  JobQueue: Symbol('JobQueue'),
  JwtSecret: Symbol('JwtSecret'),
  Logger: Symbol('Logger'),
  PasswordHasher: Symbol('PasswordHasher'),
  PayloadToQueryConverterRegistry: Symbol('PayloadToQueryConverterRegistry'),
  QueryQueue: Symbol('QueryQueue'),
  ResponseQueue: Symbol('ResponseQueue'),
  SchemaToQueryProcessorRegistry: Symbol('SchemaToQueryProcessorRegistry'),
  UserManager: Symbol('UserManager'),
}
