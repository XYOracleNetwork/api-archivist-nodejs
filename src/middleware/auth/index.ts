import { assertEx } from '@xylabs/sdk-js'
import express, { RequestHandler, Router } from 'express'
import passport, { AuthenticateOptions } from 'passport'

import { InMemoryUserStore } from './model'
import { getProfile, postSignup, postWalletChallenge, postWalletSignup } from './routes'
import { configureJwtStrategy, configureLocalStrategy, configureWeb3Strategy, JwtLoginFunction } from './strategy'

// eslint-disable-next-line import/no-named-as-default-member
const router: Router = express.Router()

const noSession: AuthenticateOptions = { session: false }
export const jwtRequiredHandler: RequestHandler = passport.authenticate('jwt', noSession)
export const noAuthHandler: RequestHandler = (_req, _res, next) => next()

// TODO: Don't use in-memory user store
const userStore = new InMemoryUserStore()
let loginUser: JwtLoginFunction = () => {
  throw new Error('JWT Auth Incorrectly Configured')
}

router.post('/login', (req, res, next) => {
  passport.authenticate('login', (err, user, _info) => {
    if (err || !user) {
      return next(new Error('An error occurred.'))
    }
    return loginUser(user, req, res, next)
  })(req, res, next)
})
router.get('/profile', jwtRequiredHandler, getProfile)
router.post('/signup', passport.authenticate('signup', noSession), postSignup)

// NOTE: Should separate out into separate middleware
router.post('/wallet/signup', postWalletSignup(userStore))
router.post('/wallet/challenge', postWalletChallenge)
router.post('/wallet/verify', (req, res, next) => {
  passport.authenticate('web3', (err, user, _info) => {
    if (err || !user) {
      return next(new Error('An error occurred.'))
    }
    return loginUser(user, req, res, next)
  })(req, res, next)
})

export interface IAuthConfig {
  secretOrKey?: string
}

export const configureAuth: (config?: IAuthConfig) => Router = (config) => {
  assertEx(config?.secretOrKey, 'Missing JWT secretOrKey')
  loginUser = configureJwtStrategy(config?.secretOrKey as string)
  configureLocalStrategy(userStore)
  configureWeb3Strategy(userStore)
  return router
}
