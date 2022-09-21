import { otherUnitTestSigningAccount } from '../Account'
import { TestWeb3User } from '../Model'
import { signInUser } from './signInUser'

export const getTokenForOtherUnitTestUser = (): Promise<string> => {
  const account = otherUnitTestSigningAccount
  const user: TestWeb3User = {
    address: account.addressValue.hex,
    privateKey: account.private.hex,
  }
  return signInUser(user)
}
