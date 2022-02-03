import { StatusCodes } from 'http-status-codes'

import { claimArchive, getArchivist, getTokenForNewUser } from '../../test'

describe('/archive', () => {
  let token = ''
  beforeEach(async () => {
    token = await getTokenForNewUser()
  })
  it('Returns the users archives', async () => {
    const claimArchiveResponse = await claimArchive(token)
    const response = await getArchivist().get('/archive').auth(token, { type: 'bearer' }).expect(StatusCodes.OK)
    expect(response.body).toEqual([claimArchiveResponse.archive])
  })
  it('Returns any empty array if the user owns no archives', async () => {
    const response = await getArchivist().get('/archive').auth(token, { type: 'bearer' }).expect(StatusCodes.OK)
    expect(response.body).toEqual([])
  })
})
