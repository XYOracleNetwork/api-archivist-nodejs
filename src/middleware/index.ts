import express, { Router } from 'express'
import jwt, { SignOptions } from 'jsonwebtoken'
import passport from 'passport'

import { configureAuthStrategies } from './authStrategies'
import { postLogin } from './login'
import { getProfile } from './profile'
import { postSignup } from './signup'

// eslint-disable-next-line import/no-named-as-default-member
const router: Router = express.Router()
router.post('/login', (req, res, next) => {
  passport.authenticate('login', (err, user, _info) => {
    try {
      if (err || !user) {
        const error = new Error('An error occurred.')
        return next(error)
      }
      req.login(user, { session: false }, (error) => {
        if (error) return next(error)
        const body = {
          _id: user._id,
          email: user.email,
        }
        const options: SignOptions = {
          algorithm: 'HS256', // 'HS512' once we perf
          audience: 'archivist',
          expiresIn: '1 day',
          issuer: 'archivist',
          subject: user._id,
        }
        // eslint-disable-next-line import/no-named-as-default-member
        const token = jwt.sign({ user: body }, 'TOP_SECRET', options)
        return res.json({ token })
      })
    } catch (error) {
      return next(error)
    }
  })(req, res, next)
})
router.get('/profile', passport.authenticate('jwt', { session: false }), getProfile)
router.post('/signup', passport.authenticate('signup', { session: false }), postSignup)

export interface IMiddlewareConfig {
  secretOrKey?: string | Buffer | undefined
  issuer?: string | undefined
  audience?: string | undefined
}

export const middleware: (config?: IMiddlewareConfig) => Router = () => {
  configureAuthStrategies()
  return router
}
