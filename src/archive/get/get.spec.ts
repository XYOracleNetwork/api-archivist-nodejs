import { StatusCodes } from 'http-status-codes'

import { getArchiveName, getArchivist, getExistingWeb2User, ITestWeb2User, signInWeb2User } from '../../test'

describe('/archive', () => {
  let token = ''
  let user: ITestWeb2User = {
    email: '',
    password: '',
  }
  beforeEach(async () => {
    user = await getExistingWeb2User()
    token = await signInWeb2User(user)
  })
  it('Returns the users archives', async () => {
    const archive = getArchiveName()
    await getArchivist().put(`/archive/${archive}`).auth(token, { type: 'bearer' }).expect(StatusCodes.OK)
    const response = await getArchivist().get('/archive').auth(token, { type: 'bearer' })
    expect(response.body).toEqual([archive])
  })
  it('Returns any empty array if the user owns no archives', async () => {
    const response = await getArchivist().get('/archive').auth(token, { type: 'bearer' })
    expect(response.body).toEqual([])
  })
})
