// Since Passport augments each successfully auth'd request
// with our User, we need to redefine the default Express
// User (just an empty Object) to be our User so we don't
// have to cast every request
import { UserWithoutId } from '@xyo-network/archivist-model'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import passport from 'passport'

export interface UserCreationAuthInfo {
  updated?: boolean
}

// https://github.com/DefinitelyTyped/DefinitelyTyped/commit/91c229dbdb653dbf0da91992f525905893cbeb91#r34812715
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface User extends UserWithoutId {
      id?: string
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface AuthInfo extends UserCreationAuthInfo {}
  }
}

export * from './archiveLocals'
export * from './auth'
export * from './Diviner'
export * from './doc'
export * from './Manager'
export * from './nodeEnv'
export * from './PasswordHasher'
export * from './QueryProcessor'
export * from './RequestToQueryConverter'
export * from './rollbar'
export * from './standardResponses'
