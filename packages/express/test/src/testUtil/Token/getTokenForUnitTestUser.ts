import { unitTestSigningAccount } from '../Account'
import { TestWeb3User } from '../Model'
import { signInUser } from './signInUser'

export const getTokenForUnitTestUser = (): Promise<string> => {
  const account = unitTestSigningAccount
  const user: TestWeb3User = {
    address: account.addressValue.hex,
    privateKey: account.private.hex,
  }
  return signInUser(user)
}
