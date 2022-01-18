import { utils } from 'ethers'
import { Request } from 'express'
import passport, { Strategy, StrategyCreated, StrategyCreatedStatic } from 'passport'
import { validate } from 'uuid'

import { IUserStore, IWeb3User, User } from '../model'

const GREGORIAN_OFFSET = 122192928000000000
const oneHourInMs = 3600000

const getTimeFromUuid = (uuidV1: string) => {
  const parts = uuidV1.split('-')
  const time = [parts[2].substring(1), parts[1], parts[0]].join('')
  return parseInt(time, 16)
}

const getDateFromUuid = (uuidV1: string) => {
  const time = getTimeFromUuid(uuidV1) - GREGORIAN_OFFSET
  const milliseconds = Math.floor(time / 10000)
  return new Date(milliseconds)
}

/**
 *
 * @param uuid UUIDv1 string
 * @returns true if the string was a valid UUIDv1 and generated today
 */
const verifyUuid = (uuid: string): boolean => {
  try {
    if (validate(uuid)) {
      const uuidDate = getDateFromUuid(uuid)
      const now = new Date()
      const timeSinceIssuance = now.getTime() - uuidDate.getTime()
      return timeSinceIssuance < oneHourInMs
    }
  } catch (error) {
    return false
  }
  return false
}

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
