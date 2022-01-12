import 'source-map-support/register'

import { RequestHandler } from 'express'
import { StatusCodes } from 'http-status-codes'

export const postSignup: RequestHandler = (req, res, next) => {
  res.sendStatus(StatusCodes.NOT_IMPLEMENTED)
  next({
    message: 'Not Implemented',
  })
}
