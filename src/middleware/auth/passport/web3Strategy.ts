import { utils } from 'ethers'
import { Request } from 'express'
import passport, { Strategy, StrategyCreated, StrategyCreatedStatic } from 'passport'

import { IUserStore, IWeb3User, User } from '../model'

const verifyPublicKey = (message: string, signature: string, publicKey: string) => {
  try {
    const key = utils.verifyMessage(message, signature)
    return publicKey.toLowerCase() === key.toLowerCase()
  } catch (error) {
    // TODO: Logging
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
    const { publicKey } = req.params
    const { message, signature } = req.body
    if (!publicKey || !message || !signature) {
      this.error({ message: 'Missing request values' })
      return
    }
    if (!verifyPublicKey(message, signature, publicKey)) {
      this.fail()
      return
    }
    const user =
      ((await ((this as unknown as Web3AuthStrategy).userStore as Required<IUserStore<User>>)?.getByPublicKey(
        publicKey
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
