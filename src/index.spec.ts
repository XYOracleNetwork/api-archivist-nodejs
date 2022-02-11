import { StatusCodes } from 'http-status-codes'

import { getArchivist } from './test'

describe('/', () => {
  it('Provides health checks', async () => {
    const response = await getArchivist().get('/').expect(StatusCodes.OK)
    expect(response.body.data).toEqual({ alive: true })
  })
})
