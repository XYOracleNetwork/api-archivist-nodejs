import { assertEx } from '@xylabs/sdk-js'
import express, { RequestHandler, Router } from 'express'
import passport, { AuthenticateOptions } from 'passport'

import { ArchiveOwnerStore, GetArchivesByUserFn, getUserMongoSdk, MongoDBUserStore, UserWithoutId } from './model'
import { getProfile, postSignup, postWalletChallenge } from './routes'
import {
  configureAdminApiKeyStrategy,
  configureArchiveApiKeyStrategy,
  configureArchiveOwnerStrategy,
  configureJwtStrategy,
  configureLocalStrategy,
  configureWeb3Strategy,
} from './strategy'

// eslint-disable-next-line import/no-named-as-default-member
const router: Router = express.Router()

const noSession: AuthenticateOptions = { session: false }

export const requireArchiveApiKey: RequestHandler = passport.authenticate('archiveApiKey', noSession)
export const requireLoggedIn: RequestHandler = passport.authenticate('jwt', noSession)
export const requireAuth: RequestHandler = passport.authenticate(['archiveApiKey', 'jwt'], noSession)
export const requireArchiveOwner: RequestHandler[] = [requireAuth, passport.authenticate('archiveOwner', noSession)]
export const allowAnonymous: RequestHandler = (_req, _res, next) => next()

let respondWithJwt: RequestHandler = () => {
  throw new Error('JWT Auth Incorrectly Configured')
}

// web2 flow
router.post('/login', passport.authenticate('login', noSession), (req, res, next) => respondWithJwt(req, res, next))
router.post('/signup', passport.authenticate('adminApiKeyUserSignup', noSession), postSignup)

// web3 flow
router.post('/wallet/challenge', postWalletChallenge)
router.post('/wallet/verify', passport.authenticate('web3', noSession), (req, res, next) =>
  respondWithJwt(req, res, next)
)

router.get('/profile', requireLoggedIn, getProfile)

export interface IAuthConfig {
  secretOrKey?: string
  apiKey?: string
  getUserArchives: GetArchivesByUserFn
}

export const configureAuth: (config: IAuthConfig) => Promise<Router> = async (config) => {
  assertEx(config?.secretOrKey, 'Missing JWT secretOrKey')
  const secretOrKey = config?.secretOrKey as string
  assertEx(config?.apiKey, 'Missing API Key')
  const apiKey = config?.apiKey as string

  const archiveOwnerStore = new ArchiveOwnerStore(config.getUserArchives)
  const userMongoSdk = await getUserMongoSdk()
  const userStore = new MongoDBUserStore(userMongoSdk)

  configureAdminApiKeyStrategy(userStore, apiKey)
  configureArchiveApiKeyStrategy(userStore)
  configureArchiveOwnerStrategy(archiveOwnerStore)
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
