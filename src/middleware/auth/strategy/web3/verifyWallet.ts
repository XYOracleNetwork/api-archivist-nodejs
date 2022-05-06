import { utils } from 'ethers'

import { trimAddressPrefix } from './addressPrefix'

export const verifyWallet = (message: string, signature: string, address: string) => {
  try {
    const signingAddress = trimAddressPrefix(utils.verifyMessage(message, signature).toLowerCase())
    const walletAddress = trimAddressPrefix(address.toLowerCase())
    return signingAddress === walletAddress
  } catch (error) {
    return false
  }
}
