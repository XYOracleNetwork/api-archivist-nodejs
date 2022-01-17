import 'source-map-support/register'

import { RequestHandler } from 'express'
import { StatusCodes } from 'http-status-codes'

import { IUserStore, IWeb3User, User } from '../../../model'

export const postWalletSignup =
  (userStore: IUserStore<User>): RequestHandler =>
  async (req, res, _next) => {
    const { address } = req.body
    if (!address) {
      res.sendStatus(StatusCodes.BAD_REQUEST)
      return
    }
    // Create user
    const userToCreate: IWeb3User = { address: address }

    // Store the user
    const user: User = await userStore.create(userToCreate)

    // Return the user
    res.json({ user })
  }
