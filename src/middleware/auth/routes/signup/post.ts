import 'source-map-support/register'

import { RequestHandler } from 'express'

export const postSignup: RequestHandler = (req, res, _next) => {
  res.json({
    message: 'Signup successful',
    user: req.user,
  })
}
