import { assertEx } from '@xylabs/sdk-js'
import express, { RequestHandler, Router } from 'express'
import passport from 'passport'

import { getUserMongoSdk, MongoDBUserStore, UserWithoutId } from './model'
import { getProfile, postSignup, postWalletChallenge } from './routes'
import {
  adminApiKeyUserSignupStrategy,
  archiveAccessControlStrategyName,
  archiveApiKeyStrategy,
  archiveApiKeyStrategyName,
  archiveOwnerStrategy,
  configureAdminApiKeyStrategy,
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
 * Require that the user can, in some way, access the archive. Either by owning
 * the archive OR by the archive being pulbic (having no access control)
 */
export const requireArchiveAccess: RequestHandler[] = passport.authenticate(
  [archiveAccessControlStrategyName, jwtStrategyName, archiveApiKeyStrategyName],
  {
    session: false,
  }
)

/**
 * Allow anonymous requests
 */
export const allowAnonymous: RequestHandler = (_req, _res, next) => next()

// Properly initialized after auth is configured
let respondWithJwt: RequestHandler = () => {
  throw new Error('JWT Auth Incorrectly Configured')
}

router.post(
  '/signup',
  adminApiKeyUserSignupStrategy,
  postSignup /*
    #swagger.tags = ['user']
    #swagger.basePath = '/user'
  */
)

// web2 flow
router.post(
  '/login',
  localStrategy,
  (req, res, next) => respondWithJwt(req, res, next)
  /*
    #swagger.tags = ['user']
    #swagger.basePath = '/user'
  */
)

// web3 flow
router.post(
  '/wallet/challenge',
  postWalletChallenge /*
    #swagger.tags = ['user']
    #swagger.basePath = '/user'
  */
)
router.post(
  '/wallet/verify',
  web3Strategy,
  (req, res, next) => respondWithJwt(req, res, next) /*
    #swagger.tags = ['user']
    #swagger.basePath = '/user'
  */
)

router.get(
  '/profile',
  requireLoggedIn,
  getProfile /*
    #swagger.tags = ['user']
    #swagger.basePath = '/user'
  */
)

export interface AuthConfig {
  secretOrKey?: string
  apiKey?: string
}

export const configureAuth: (config: AuthConfig) => Promise<Router> = async (config) => {
  assertEx(config?.secretOrKey, 'Missing JWT secretOrKey')
  const secretOrKey = config?.secretOrKey as string
  assertEx(config?.apiKey, 'Missing API Key')
  const apiKey = config?.apiKey as string

  const userMongoSdk = await getUserMongoSdk()
  const userStore = new MongoDBUserStore(userMongoSdk)

  configureAdminApiKeyStrategy(userStore, apiKey)
  configureArchiveApiKeyStrategy(userStore)
  configureArchiveOwnerStrategy()
  configureArchiveAccessControlStrategy()
  respondWithJwt = configureJwtStrategy(secretOrKey)
  configureLocalStrategy(userStore)
  configureWeb3Strategy(userStore)

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
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface User extends UserWithoutId {
      id?: string
    }
  }
}
