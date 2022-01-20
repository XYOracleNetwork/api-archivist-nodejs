import 'source-map-support/register'

import { RequestHandler } from 'express'

import { toUserDto } from '../../dto'

const message = 'Signup successful'
export const postSignup: RequestHandler = (req, res, next) => {
  const user = toUserDto(req.user)
  res.json({
    message,
    user,
  })
  next()
}
