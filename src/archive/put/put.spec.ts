import { ReasonPhrases, StatusCodes } from 'http-status-codes'

import { claimArchive, getArchiveName, getArchivist, getTokenForNewUser } from '../../test'

describe('/archive', () => {
  let token = ''
  let archive = ''
  beforeEach(async () => {
    token = await getTokenForNewUser()
    archive = getArchiveName()
  })
  it('Allows the user to claim an unclaimed archive', async () => {
    const response = await claimArchive(token, archive)
    expect(response.archive).toEqual(archive)
  })
  it(`Returns ${ReasonPhrases.FORBIDDEN} if user claims an already claimed archive`, async () => {
    // User 1 claims archive
    await claimArchive(token, archive)

    // User 2 attempts to claim archive
    const user2Token = await getTokenForNewUser()
    await getArchivist().put(`/archive/${archive}`).auth(user2Token, { type: 'bearer' }).expect(StatusCodes.FORBIDDEN)
  })
})
