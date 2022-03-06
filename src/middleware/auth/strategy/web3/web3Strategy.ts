import { Request } from 'express'
import { Strategy, StrategyCreated, StrategyCreatedStatic } from 'passport'

import { IUserStore } from '../../model'
import { createUserFromRequest } from '../lib'
import { verifyUuid } from './verifyUuid'
import { verifyWallet } from './verifyWallet'

export class Web3AuthStrategy extends Strategy {
  constructor(public readonly userStore: IUserStore) {
    super()
  }
  override async authenticate(
    this: StrategyCreated<this, this & StrategyCreatedStatic>,
    req: Request,
    _options?: unknown
  ) {
    try {
      const { address, message, signature } = req.body
      if (!address || !message || !signature) {
        this.fail('Missing request values')
        return
      }
      if (!verifyWallet(message, signature, address)) {
        this.fail('Invalid signature')
        return
      }
      if (!verifyUuid(message)) {
        this.fail('Invalid message')
        return
      }

      // Lookup existing user
      const user = await this.userStore.getByWallet(address)
      if (user) {
        // if found, return them
        this.success(user, { updated: false })
        return
      } else {
        // if not found, create them (since they've verified they own the wallet)
        const createdUser = await createUserFromRequest(req, this.userStore)
        if (!createdUser) {
          this.error({ message: 'Error creating user' })
          return
        }
        this.success(createdUser, { updated: createdUser.updated })
        return
      }
    } catch (error) {
      this.error({ message: 'Web3 Auth Error' })
    }
  }
}
