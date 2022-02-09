import { utils } from 'ethers'

export const verifyWallet = (message: string, signature: string, address: string) => {
  try {
    const key = utils.verifyMessage(message, signature)
    return address.toLowerCase() === key.toLowerCase()
  } catch (error) {
    console.error(error)
    return false
  }
}
