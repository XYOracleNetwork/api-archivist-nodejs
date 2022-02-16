import { getExistingWeb3User, getNewWeb3User, signInWeb3User, TestWeb3User } from '../../../../test'

const verifySignIn = async (user: TestWeb3User) => {
  const token = await signInWeb3User(user)
  expect(token).not.toBeNull()
  expect(token).not.toEqual('')
}

describe('Web3AuthStrategy', () => {
  it('Can sign-in existing user', async () => {
    await verifySignIn(await getExistingWeb3User())
  })
  it('Successful sign-in creates user if they do not already exist', async () => {
    await verifySignIn(await getNewWeb3User())
  })
})
