import 'source-map-support/register'

import { RequestHandler } from 'express'
import { StatusCodes } from 'http-status-codes'

import { toUserDto } from '../../dto'

const message = 'Signup successful'
export const postSignup: RequestHandler = (req, res, next) => {
  const updated = req?.authInfo?.updated
  const user = toUserDto(req.user)
  res.status(updated ? StatusCodes.OK : StatusCodes.CREATED).json({
    message,
    user,
  })
  next()
}
