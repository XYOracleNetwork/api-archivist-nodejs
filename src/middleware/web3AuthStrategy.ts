import { Request } from 'express'
import { Strategy, StrategyCreated, StrategyCreatedStatic } from 'passport'
import Web3 from 'web3'

import { IUserStore, IWeb3User, User } from './userStore'

const web3 = new Web3()

const verifyPublicKey = (message: string, signature: string, publicKey: string) => {
  const key = web3.eth.accounts.recover(message, signature)
  return publicKey === key
}

export class Web3AuthStrategy extends Strategy {
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
