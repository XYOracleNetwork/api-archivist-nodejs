import { utils } from 'ethers'

import { trimAddressPrefix } from './addressPrefix'

export const verifyWallet = (message: string, signature: string, address: string) => {
  try {
    const key = utils.verifyMessage(message, signature)
    return trimAddressPrefix(address.toLowerCase()) === trimAddressPrefix(key.toLowerCase())
  } catch (error) {
    console.error(error)
    return false
  }
}
