import { StatusCodes } from 'http-status-codes'

import { claimArchive, getArchivist, getExistingWeb2User, ITestWeb2User, signInWeb2User } from '../../../../test'

describe('/archive/:archive/settings/keys', () => {
  let token = ''
  let user: ITestWeb2User = {
    email: '',
    password: '',
  }
  let archive = ''
  beforeEach(async () => {
    user = await getExistingWeb2User()
    token = await signInWeb2User(user)
    archive = await claimArchive(token)
  })
  it('Returns the keys for the archive', async () => {
    const createKeyResponse = await getArchivist()
      .post(`/archive/${archive}/settings/keys`)
      .auth(token, { type: 'bearer' })
      .expect(StatusCodes.OK)
    const response = await getArchivist()
      .get(`/archive/${archive}/settings/keys`)
      .auth(token, { type: 'bearer' })
      .expect(StatusCodes.OK)
    expect(response.body).toEqual([createKeyResponse.body.key])
  })
  it('Returns any empty array if there are no keys for the archive', async () => {
    const response = await getArchivist()
      .get(`/archive/${archive}/settings/keys`)
      .auth(token, { type: 'bearer' })
      .expect(StatusCodes.OK)
    expect(response.body).toEqual([])
  })
})
