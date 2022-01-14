import 'source-map-support/register'

import { RequestHandler } from 'express'

export const postWalletVerify: RequestHandler = (req, res, _next) => {
  res.json({
    token: req.query.secret_token,
    user: req.user,
  })
  return
}
