import 'source-map-support/register'

import { RequestHandler } from 'express'

export const postLogin: RequestHandler = (req, res, _next) => {
  res.json({
    message: 'Login successful',
    user: req.user,
  })
}
