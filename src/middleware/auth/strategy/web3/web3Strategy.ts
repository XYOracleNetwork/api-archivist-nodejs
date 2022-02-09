import { Request } from 'express'
import { Strategy, StrategyCreated, StrategyCreatedStatic } from 'passport'

import { IUserStore } from '../../model'
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
      let user = await this.userStore.getByWallet(address)
      if (!user) {
        user = await this.userStore.create({ address })
      }
      this.success(user)
      return
    } catch (error) {
      this.error({ message: 'Web3 Auth Error' })
    }
  }
}
