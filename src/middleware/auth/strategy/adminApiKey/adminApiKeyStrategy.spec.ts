import { StatusCodes } from 'http-status-codes'

import { getExistingWeb2User, getExistingWeb3User, getNewWeb2User } from '../../../../test'

describe('/user/signup', () => {
  it('Creates a user with email/password', async () => {
    await getExistingWeb2User()
  })
  it('Creates a user with wallet address', async () => {
    await getExistingWeb3User()
  })
  it.only('Updates an existing user', async () => {
    const user = await getExistingWeb2User()
    user.password = getNewWeb2User().password
    const actual = await getExistingWeb2User(user, StatusCodes.OK)
    expect(actual.email).toEqual(user.email)
  })
})
