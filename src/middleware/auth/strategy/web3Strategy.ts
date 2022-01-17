import { utils } from 'ethers'
import { Request } from 'express'
import passport, { Strategy, StrategyCreated, StrategyCreatedStatic } from 'passport'

import { IUserStore, IWeb3User, User } from '../model'

const verifyWallet = (message: string, signature: string, address: string) => {
  try {
    const key = utils.verifyMessage(message, signature)
    return address.toLowerCase() === key.toLowerCase()
  } catch (error) {
    console.error(error)
    return false
  }
}

class Web3AuthStrategy extends Strategy {
  constructor(protected readonly userStore: IUserStore<User>) {
    super()
  }

  override async authenticate(
    this: StrategyCreated<this, this & StrategyCreatedStatic>,
    req: Request,
    _options?: unknown
  ) {
    const { address, message, signature } = req.body
    if (!address || !message || !signature) {
      this.error({ message: 'Missing request values' })
      return
    }
    if (!verifyWallet(message, signature, address)) {
      this.fail()
      return
    }
    const user =
      ((await ((this as unknown as Web3AuthStrategy).userStore as Required<IUserStore<User>>)?.getByWallet(
        address
      )) as IWeb3User) || null
    if (!user) {
      this.error({ message: 'User not found' })
      return
    }
    this.success(user)
    return
  }
}

export const configureWeb3Strategy = (userStore: IUserStore<User>) => {
  passport.use('web3', new Web3AuthStrategy(userStore))
}
