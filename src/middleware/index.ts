import express, { Router } from 'express'
import jwt from 'jsonwebtoken'
import passport from 'passport'

import { configureAuth } from './auth'
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
        const body = { _id: user._id, email: user.email }
        // eslint-disable-next-line import/no-named-as-default-member
        const token = jwt.sign({ user: body }, 'TOP_SECRET')
        return res.json({ token })
      })
    } catch (error) {
      return next(error)
    }
  })(req, res, next)
})
router.get('/profile', getProfile)
router.post('/signup', passport.authenticate('signup', { session: false }), postSignup)

export const middleware: () => Router = () => {
  configureAuth()
  return router
}
