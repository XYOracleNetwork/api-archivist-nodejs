import 'source-map-support/register'

import { RequestHandler } from 'express'
import { StatusCodes } from 'http-status-codes'
import { v4 } from 'uuid'

export const getWalletChallenge: RequestHandler = (req, res, _next) => {
  const { publicKey } = req.params
  if (!publicKey) {
    res.sendStatus(StatusCodes.BAD_REQUEST)
  }
  const state = v4()
  res.json({ publicKey, state })
}
