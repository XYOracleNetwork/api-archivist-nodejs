import 'source-map-support/register'

import { RequestHandler } from 'express'

import { toUserDto } from '../../dto'

export const getProfile: RequestHandler = (req, res, next) => {
  const user = toUserDto(req.user)
  res.json({
    user,
  })
  next()
}
