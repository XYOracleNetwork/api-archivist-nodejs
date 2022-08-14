// TODO: Move this to MongoDB Project
const MONGO_TYPES = {
  ArchiveArchivistMongoDb: Symbol('ArchiveArchivistMongoDb'),
  ArchiveKeySdkMongo: Symbol('ArchiveKeySdkMongo'),
  ArchiveSdkMongo: Symbol('ArchiveSdkMongo'),
  BoundWitnessSdkMongo: Symbol('BoundWitnessSdkMongo'),
  PayloadSdkMongo: Symbol('PayloadSdkMongo'),
  UserArchivistMongoDb: Symbol('UserArchivistMongoDb'),
  UserManagerMongoDb: Symbol('UserManagerMongoDb'),
  UserSdkMongo: Symbol('UserSdkMongo'),
  XyoArchiveKeySdkMongo: Symbol('XyoArchiveKeySdkMongo'),
}

export const TYPES = {
  ...MONGO_TYPES,
  Account: Symbol('Account'),
  ApiKey: Symbol('ApiKey'),
  ArchiveArchivist: Symbol('ArchiveArchivist'),
  ArchiveKeyArchivist: Symbol('ArchiveKeyArchivist'),
  ArchivePermissionsArchivist: Symbol('ArchivePermissionsArchivist'),
  JwtSecret: Symbol('JwtSecret'),
  Logger: Symbol('Logger'),
  PasswordHasher: Symbol('PasswordHasher'),
  PayloadToQueryConverterRegistry: Symbol('PayloadToQueryConverterRegistry'),
  QueryQueue: Symbol('QueryQueue'),
  ResponseQueue: Symbol('ResponseQueue'),
  SchemaCountDiviner: Symbol('SchemaCountDiviner'),
  SchemaToQueryProcessorRegistry: Symbol('SchemaToQueryProcessorRegistry'),
  UserArchivist: Symbol('UserArchivist'),
  UserManager: Symbol('UserManager'),
  WitnessedPayloadArchivist: Symbol('WitnessedPayloadArchivist'),
}
