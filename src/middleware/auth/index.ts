import { assertEx } from '@xylabs/sdk-js'
import express, { RequestHandler, Router } from 'express'
import passport from 'passport'

import { UserWithoutId } from '../../model'
import { getUserMongoSdk, MongoDBUserStore, UserCreationAuthInfo } from './model'
import { getUserProfile, postAccountChallenge, postUserSignup } from './routes'
import {
  adminApiKeyStrategy,
  allowUnauthenticatedStrategyName,
  archiveAccessControlStrategy,
  archiveApiKeyStrategy,
  archiveApiKeyStrategyName,
  archiveOwnerStrategy,
  configureAdminApiKeyStrategy,
  configureAllowUnauthenticatedStrategy,
  configureArchiveAccessControlStrategy,
  configureArchiveApiKeyStrategy,
  configureArchiveOwnerStrategy,
  configureJwtStrategy,
  configureLocalStrategy,
  configureWeb3Strategy,
  jwtStrategy,
  jwtStrategyName,
  localStrategy,
  web3Strategy,
} from './strategy'

// eslint-disable-next-line import/no-named-as-default-member
const router: Router = express.Router()

/**
 * Require an Archive API Key in the appropriate request header
 */
export const requireArchiveApiKey: RequestHandler = archiveApiKeyStrategy

/**
 * Require logged-in user as evidenced by a JWT in the request Auth header
 */
export const requireLoggedIn: RequestHandler = jwtStrategy

/**
 * Require either an API key OR logged-in user
 */
export const requireAuth: RequestHandler = passport.authenticate([jwtStrategyName, archiveApiKeyStrategyName], {
  session: false,
})

/**
 * Require an auth'd request AND that the account owns the archive being requested
 */
export const requireArchiveOwner: RequestHandler[] = [requireAuth, archiveOwnerStrategy]

/**
 * If present, require API key OR JWT to be valid, but if absent, allow anonymous access
 */
export const allowAnonymous: RequestHandler = passport.authenticate([jwtStrategyName, archiveApiKeyStrategyName, allowUnauthenticatedStrategyName], {
  session: false,
})

/**
 * Require that the user can, in some way, access the archive. Either by owning
 * the archive OR by the archive being public (having no access control)
 */
export const requireArchiveAccess: RequestHandler[] = [allowAnonymous, archiveAccessControlStrategy]

// Properly initialized after auth is configured
let respondWithJwt: RequestHandler = () => {
  throw new Error('JWT Auth Incorrectly Configured')
}

// web2 flow
router.post(
  '/user/login',
  localStrategy,
  (req, res, next) => respondWithJwt(req, res, next)
  /*
    #swagger.tags = ['User']
    #swagger.basePath = '/'
    #swagger.summary = 'Log in (web2)'
  */
)

// web3 flow
router.post(
  '/account/:address/challenge',
  postAccountChallenge /*
    #swagger.tags = ['Account']
    #swagger.basePath = '/'
    #swagger.summary = 'Challenge (web3)'
  */
)
router.post(
  '/wallet/:address/challenge',
  postAccountChallenge /*
    #swagger.tags = ['Wallet']
    #swagger.basePath = '/'
    #swagger.deprecated = true
    #swagger.summary = 'Temporary support for legacy calls'
  */
)
router.post(
  '/account/:address/verify',
  web3Strategy,
  (req, res, next) => respondWithJwt(req, res, next) /*
    #swagger.tags = ['Account']
    #swagger.basePath = '/'
    #swagger.summary = 'Verify (web3)'
  */
)
router.post(
  '/wallet/:address/verify',
  web3Strategy,
  (req, res, next) => respondWithJwt(req, res, next) /*
    #swagger.tags = ['Wallet']
    #swagger.basePath = '/'
    #swagger.deprecated = true
    #swagger.summary = 'Temporary support for legacy calls'
  */
)

router.get(
  '/user/profile',
  requireLoggedIn,
  getUserProfile /*
    #swagger.tags = ['User']
    #swagger.basePath = '/'
    #swagger.summary = 'Get user profile data'
  */
)

export interface AuthConfig {
  apiKey?: string
  secretOrKey?: string
}

export const configureAuth: (config: AuthConfig) => Router = (config) => {
  assertEx(config?.secretOrKey, 'Missing JWT secretOrKey')
  const secretOrKey = config?.secretOrKey as string
  assertEx(config?.apiKey, 'Missing API Key')
  const apiKey = config?.apiKey as string

  configureAdminApiKeyStrategy(apiKey)
  configureAllowUnauthenticatedStrategy()
  configureArchiveAccessControlStrategy()
  configureArchiveApiKeyStrategy()
  configureArchiveOwnerStrategy()
  respondWithJwt = configureJwtStrategy(secretOrKey)
  configureLocalStrategy()
  configureWeb3Strategy()

  // TODO: Now that it's configured via DI instead of at startup, move to a standard route file
  router.post(
    '/user/signup',
    adminApiKeyStrategy,
    postUserSignup /*
      #swagger.tags = ['User']
      #swagger.basePath = '/'
      #swagger.summary = 'Create an account (web2)'
    */
  )

  return router
}

// Since Passport augments each successfully auth'd request
// with our User, we need to redefine the default Express
// User (just an empty Object) to be our User so we don't
// have to cast every request
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
