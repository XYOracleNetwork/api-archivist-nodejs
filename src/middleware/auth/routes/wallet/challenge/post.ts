import 'source-map-support/register'

import { RequestHandler } from 'express'
import { StatusCodes } from 'http-status-codes'
import { v4 } from 'uuid'

export const postWalletChallenge: RequestHandler = (req, res, _next) => {
  const { address } = req.body
  if (!address) {
    res.sendStatus(StatusCodes.BAD_REQUEST)
    return
  }
  // TODO: Store these somewhere to verify we actually generated them
  // to prevent replay attacks. Possibly use time-based UUID with window
  // validation.
  const state = v4()
  res.json({ state })
}
