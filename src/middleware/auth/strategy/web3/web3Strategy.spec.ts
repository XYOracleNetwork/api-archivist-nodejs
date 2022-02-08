import { getExistingWeb3User, getNewWeb3User, signInWeb3User } from '../../../../test'

describe('Web3AuthStrategy', () => {
  it('Can sign-in existing user', async () => {
    const user = await getExistingWeb3User()
    const token = await signInWeb3User(user)
    expect(token).not.toBeNull()
    expect(token).not.toEqual('')
  })
  it('Successful sign-in creates user if they do not already exist', async () => {
    const user = await getNewWeb3User()
    const token = await signInWeb3User(user)
    expect(token).not.toBeNull()
    expect(token).not.toEqual('')
  })
})
