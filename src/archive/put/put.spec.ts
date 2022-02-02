import { ReasonPhrases, StatusCodes } from 'http-status-codes'

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
  it('Allows the user to claim an unclaimed archive', async () => {
    const archive = getArchiveName()
    const response = await getArchivist()
      .put(`/archive/${archive}`)
      .auth(token, { type: 'bearer' })
      .expect(StatusCodes.OK)
    expect(response.body.archive).toEqual(archive)
  })
  it(`Returns ${ReasonPhrases.CONFLICT} if user claims an already claimed archive`, async () => {
    const archive = getArchiveName()
    const response = await getArchivist()
      .put(`/archive/${archive}`)
      .auth(token, { type: 'bearer' })
      .expect(StatusCodes.OK)
    expect(response.body.archive).toEqual(archive)

    const user2 = await getExistingWeb2User()
    const user2Token = await signInWeb2User(user2)
    await getArchivist().put(`/archive/${archive}`).auth(user2Token, { type: 'bearer' }).expect(StatusCodes.CONFLICT)
  })
})
