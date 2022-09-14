import { ARCHIVIST_TYPES } from './archivist'
import { DIVINER_TYPES } from './diviner'

export const TYPES = {
  Account: Symbol('Account'),
  ApiKey: Symbol('ApiKey'),
  ...ARCHIVIST_TYPES,
  ...DIVINER_TYPES,
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
