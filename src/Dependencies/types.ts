const MONGO_TYPES = {
  ArchiveArchivistMongoDb: Symbol('ArchiveArchivistMongoDb'),
  ArchiveSdkMongo: Symbol('ArchiveSdkMongo'),
  BoundWitnessSdkMongo: Symbol('BoundWitnessSdkMongo'),
  PayloadSdkMongo: Symbol('PayloadSdkMongo'),
  UserArchivistMongoDb: Symbol('UserArchivistMongoDb'),
  UserManagerMongoDb: Symbol('UserManagerMongoDb'),
  UserSdkMongo: Symbol('UserSdkMongo'),
}

export const TYPES = {
  ...MONGO_TYPES,
  Account: Symbol('Account'),
  ApiKey: Symbol('ApiKey'),
  ArchiveArchivist: Symbol('ArchiveArchivist'),
  ArchivePermissionsArchivist: Symbol('ArchivePermissionsArchivist'),
  Logger: Symbol('Logger'),
  PasswordHasher: Symbol('PasswordHasher'),
  PayloadToQueryConverterRegistry: Symbol('PayloadToQueryConverterRegistry'),
  QueryQueue: Symbol('QueryQueue'),
  ResponseQueue: Symbol('ResponseQueue'),
  SchemaToQueryProcessorRegistry: Symbol('SchemaToQueryProcessorRegistry'),
  UserArchivist: Symbol('UserArchivist'),
  UserManager: Symbol('UserManager'),
  WitnessedPayloadArchivist: Symbol('WitnessedPayloadArchivist'),
}
