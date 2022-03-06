import { StatusCodes } from 'http-status-codes'

import { claimArchive, getArchiveName, getArchivist, getTokenForNewUser } from '../../../test'

describe('/archive', () => {
  let token = ''
  let archive = ''
  beforeEach(async () => {
    token = await getTokenForNewUser()
    archive = getArchiveName()
  })
  it('Allows user to claim an unclaimed archive', async () => {
    const response = await claimArchive(token, archive, StatusCodes.CREATED)
    expect(response.archive).toEqual(archive)
  })
  it('Allows user to reclaim an archive they already own', async () => {
    let response = await claimArchive(token, archive, StatusCodes.CREATED)
    expect(response.archive).toEqual(archive)
    response = await claimArchive(token, archive, StatusCodes.OK)
    expect(response.archive).toEqual(archive)
  })
  it('Prevents users from claiming an archive already claimed by someone else', async () => {
    // User 1 claims archive
    await claimArchive(token, archive)

    // User 2 attempts to claim archive
    const user2Token = await getTokenForNewUser()
    await getArchivist().put(`/archive/${archive}`).auth(user2Token, { type: 'bearer' }).expect(StatusCodes.FORBIDDEN)
  })
})
