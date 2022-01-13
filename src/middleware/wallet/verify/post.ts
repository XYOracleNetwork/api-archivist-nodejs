import 'source-map-support/register'

import { RequestHandler } from 'express'
import { StatusCodes } from 'http-status-codes'
import Web3 from 'web3'

const web3 = new Web3()

const verifyPublicKey = (message: string, signature: string, publicKey: string) => {
  const key = web3.eth.accounts.recover(message, signature)
  return publicKey === key
}

export const postWalletVerify: RequestHandler = (req, res, _next) => {
  const { publicKey } = req.params
  const { message, signature } = req.body
  if (!publicKey || !message || !signature) {
    res.sendStatus(StatusCodes.BAD_REQUEST)
    return
  }
  if (verifyPublicKey(message, signature, publicKey)) {
    // TODO: Validated, issue JWT
    res.json({
      token: 'TODO: JWT',
    })
  }
  res.sendStatus(StatusCodes.UNAUTHORIZED)
  return
}
