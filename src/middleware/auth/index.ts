import express, { NextFunction, Request, RequestHandler, Response, Router } from 'express'
import jwt, { SignOptions } from 'jsonwebtoken'
import passport, { AuthenticateOptions } from 'passport'

import { InMemoryUserStore, IWeb2User, IWeb3User, User } from './model'
import { getProfile, postSignup, postWalletChallenge, postWalletSignup } from './routes'
import { configureJwtStrategy, configureLocalStrategy, configureWeb3Strategy } from './strategy'

// eslint-disable-next-line import/no-named-as-default-member
const router: Router = express.Router()

const noSession: AuthenticateOptions = { session: false }
export const jwtRequiredHandler: RequestHandler = passport.authenticate('jwt', noSession)
export const noAuthHandler: RequestHandler = (_req, _res, next) => next()

// TODO: Don't use in-memory user store
const userStore = new InMemoryUserStore()

export const loginUser = (user: User, req: Request, res: Response, next: NextFunction) => {
  try {
    req.login(user, { session: false }, (error) => {
      if (error) return next(error)
      const options: SignOptions = {
        algorithm: 'HS256', // 'HS512' once we perf
        audience: 'archivist',
        expiresIn: '1 day',
        issuer: 'archivist',
        subject: user.id,
      }

      // TODO: Something smarter than needing to
      // remember to sanitize response data
      // Omit sensitive data
      const responseUser: Partial<IWeb2User> & Partial<IWeb3User> = { ...user }
      delete responseUser.passwordHash
      delete responseUser.address

      // eslint-disable-next-line import/no-named-as-default-member
      const token = jwt.sign({ user: responseUser }, 'TOP_SECRET', options)
      return res.json({ token })
    })
  } catch (error) {
    return next(error)
  }
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
  secretOrKey?: string | Buffer | undefined
  issuer?: string | undefined
  audience?: string | undefined
}

export const configureAuth: (config?: IAuthConfig) => Router = () => {
  configureJwtStrategy()
  configureLocalStrategy(userStore)
  configureWeb3Strategy(userStore)
  return router
}
