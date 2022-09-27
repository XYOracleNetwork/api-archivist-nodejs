import { QueryConverterRegistry } from '@xyo-network/archivist-express-lib'
import {
  ArchiveArchivist,
  ArchiveBoundWitnessArchivistFactory,
  ArchiveKeyArchivist,
  ArchivePayloadsArchivistFactory,
  ArchivePermissionsArchivist,
  BoundWitnessArchivist,
  BoundWitnessStatsDiviner,
  PayloadArchivist,
  PayloadStatsDiviner,
  Query,
  QueryProcessorRegistry,
  SchemaStatsDiviner,
  UserManager,
  UserWithoutId,
  WitnessedPayloadArchivist,
} from '@xyo-network/archivist-model'
import { IdentifiableHuri, Queue } from '@xyo-network/archivist-queue'
// NOTE: Required import since passport types (which we need to extend) extend Express
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import passport from 'passport'

export interface UserCreationAuthInfo {
  updated?: boolean
}

// https://github.com/DefinitelyTyped/DefinitelyTyped/commit/91c229dbdb653dbf0da91992f525905893cbeb91#r34812715
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    // Since Passport augments each successfully auth'd request
    // with our User, we need to redefine the default Express
    // User (just an empty Object) to be our User so we don't
    // have to cast every request
    interface User extends UserWithoutId {
      id?: string
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface AuthInfo extends UserCreationAuthInfo {}

    interface Application {
      archiveArchivist: ArchiveArchivist
      archiveBoundWitnessArchivistFactory: ArchiveBoundWitnessArchivistFactory
      archiveKeyArchivist: ArchiveKeyArchivist
      archivePayloadsArchivistFactory: ArchivePayloadsArchivistFactory
      archivePermissionsArchivist: ArchivePermissionsArchivist
      archivistWitnessedPayloadArchivist: WitnessedPayloadArchivist
      boundWitnessStatsDiviner: BoundWitnessStatsDiviner
      boundWitnessesArchivist: BoundWitnessArchivist
      payloadStatsDiviner: PayloadStatsDiviner
      payloadsArchivist: PayloadArchivist
      queryConverters: QueryConverterRegistry
      queryProcessors: QueryProcessorRegistry
      queryQueue: Queue<Query>
      responseQueue: Queue<IdentifiableHuri>
      schemaStatsDiviner: SchemaStatsDiviner
      userManager: UserManager
    }
  }
}

export * from './archiveLocals'
export * from './auth'
export * from './doc'
export * from './nodeEnv'
export * from './PasswordHasher'
export * from './QueryProcessor'
export * from './RequestToQueryConverter'
export * from './rollbar'
export * from './standardResponses'
