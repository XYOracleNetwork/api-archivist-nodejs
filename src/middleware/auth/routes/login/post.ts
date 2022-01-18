import 'source-map-support/register'

import { RequestHandler } from 'express'

import { toUserDto } from '../../dto'

const message = 'Login successful'
export const postLogin: RequestHandler = (req, res, _next) => {
  const user = toUserDto(req.user)
  res.json({
    message,
    user,
  })
}
