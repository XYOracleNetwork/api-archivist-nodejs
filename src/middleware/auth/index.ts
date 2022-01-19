import { assertEx } from '@xylabs/sdk-js'
import express, { RequestHandler, Router } from 'express'
import passport, { AuthenticateOptions } from 'passport'

import { MongoDBUserStore } from './model'
import { getUserMongoSdk } from './model/store/mongo/getUserMongoSdk'
import { getProfile, postSignup, postWalletChallenge } from './routes'
import {
  configureApiKeyStrategy,
  configureJwtStrategy,
  configureLocalStrategy,
  configureWeb3Strategy,
} from './strategy'

// eslint-disable-next-line import/no-named-as-default-member
const router: Router = express.Router()

const noSession: AuthenticateOptions = { session: false }
export const jwtRequiredHandler: RequestHandler = passport.authenticate('jwt', noSession)
export const noAuthHandler: RequestHandler = (_req, _res, next) => next()

let respondWithJwt: RequestHandler = () => {
  throw new Error('JWT Auth Incorrectly Configured')
}

// web2 flow
router.post('/login', passport.authenticate('login', noSession), (req, res, next) => respondWithJwt(req, res, next))
router.post('/signup', passport.authenticate('apiKeyUserSignup', noSession), postSignup)

// web3 flow
router.post('/wallet/challenge', postWalletChallenge)
router.post('/wallet/verify', passport.authenticate('web3', noSession), (req, res, next) =>
  respondWithJwt(req, res, next)
)

router.get('/profile', jwtRequiredHandler, getProfile)

export interface IAuthConfig {
  secretOrKey?: string
  apiKey?: string
}

export const configureAuth: (config?: IAuthConfig) => Promise<Router> = async (config) => {
  assertEx(config?.secretOrKey, 'Missing JWT secretOrKey')
  const secretOrKey = config?.secretOrKey as string
  assertEx(config?.apiKey, 'Missing API Key')
  const apiKey = config?.apiKey as string

  const userMongoSdk = await getUserMongoSdk()
  const userStore = new MongoDBUserStore(userMongoSdk)

  respondWithJwt = configureJwtStrategy(secretOrKey)
  configureLocalStrategy(userStore)
  configureWeb3Strategy(userStore)
  configureApiKeyStrategy(userStore, apiKey)

  return router
}
