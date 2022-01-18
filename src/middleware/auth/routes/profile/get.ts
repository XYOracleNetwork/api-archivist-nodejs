import 'source-map-support/register'

import { RequestHandler } from 'express'

export const getProfile: RequestHandler = (req, res, _next) => {
  res.json({
    user: req.user,
  })
}
