import { StatusCodes } from 'http-status-codes'

import { getArchivist } from '../../test'

describe('/query/:hash', () => {
  it('is not implemented', async () => {
    const sut = getArchivist()
    await sut.get('/query/foo').expect(StatusCodes.ACCEPTED)
  })
})
