import 'source-map-support/register'

import { RequestHandler } from 'express'
import { StatusCodes } from 'http-status-codes'

import { IUserStore, IWeb3User, User } from '../../../model/userStore'

export const postWalletSignup =
  (userStore: IUserStore<User>): RequestHandler =>
  async (req, res, _next) => {
    const { publicKey } = req.params
    if (!publicKey) {
      res.sendStatus(StatusCodes.BAD_REQUEST)
    }
    // Create user
    const userToCreate: IWeb3User = { publicKey }

    // Store the user
    const user: User = await userStore.create(userToCreate)

    // Return the user
    res.json({ user })
  }
