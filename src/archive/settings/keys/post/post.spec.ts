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
  it('Creates a key for the archive', async () => {
    const createKeyResponse = await getArchivist()
      .post(`/archive/${archive}/settings/keys`)
      .auth(token, { type: 'bearer' })
      .expect(StatusCodes.OK)
    expect(createKeyResponse.body).toBeTruthy()
    expect(createKeyResponse.body.key).toBeTruthy()
    expect(createKeyResponse.body.key).toBeInstanceOf('string')
  })
})
