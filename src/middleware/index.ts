import express, { NextFunction, Request, Response, Router } from 'express'
import jwt, { SignOptions } from 'jsonwebtoken'
import passport from 'passport'

import { configureAuthStrategies } from './authStrategies'
import { getProfile } from './profile'
import { postSignup } from './signup'
import { InMemoryUserStore, IWeb2User, IWeb3User, User } from './userStore'
import { getWalletChallenge, postWalletSignup } from './wallet'

// eslint-disable-next-line import/no-named-as-default-member
const router: Router = express.Router()

const noSession = { session: false }

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
      delete (user as Partial<IWeb2User>).passwordHash
      delete (user as Partial<IWeb3User>).publicKey

      // eslint-disable-next-line import/no-named-as-default-member
      const token = jwt.sign({ user }, 'TOP_SECRET', options)
      return res.json({ token })
    })
  } catch (error) {
    return next(error)
  }
}

router.post('/login', (req, res, next) => {
  passport.authenticate('login', (err, user, _info) => {
    if (err || !user) {
      const error = new Error('An error occurred.')
      return next(error)
    }
    return loginUser(user, req, res, next)
  })(req, res, next)
})
router.get('/profile', passport.authenticate('jwt', noSession), getProfile)
router.post('/signup', passport.authenticate('signup', noSession), postSignup)

// TODO: Separate out into separate middleware
router.post('/wallet/signup/:publicKey', postWalletSignup(userStore))
router.get('/wallet/challenge/:publicKey', getWalletChallenge)
router.post('/wallet/verify/:publicKey', (req, res, next) => {
  passport.authenticate('web3', (err, user, _info) => {
    if (err || !user) {
      const error = new Error('An error occurred.')
      return next(error)
    }
    return loginUser(user, req, res, next)
  })(req, res, next)
})

export interface IMiddlewareConfig {
  secretOrKey?: string | Buffer | undefined
  issuer?: string | undefined
  audience?: string | undefined
}

export const middleware: (config?: IMiddlewareConfig) => Router = () => {
  configureAuthStrategies(userStore)
  return router
}
