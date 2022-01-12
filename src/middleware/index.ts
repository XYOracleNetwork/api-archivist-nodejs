import express, { Router } from 'express'

import { postLogin } from './login'
import { getProfile } from './profile'
import { postSignup } from './signup'

// eslint-disable-next-line import/no-named-as-default-member
const router: Router = express.Router()
router.post('/login', postLogin)
router.get('/profile', getProfile)
router.post('/signup', postSignup)

export const middleware: () => Router = () => {
  return router
}
