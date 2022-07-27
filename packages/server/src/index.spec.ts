import { getArchivist } from '@xyo-network/archivist-test'
import { StatusCodes } from 'http-status-codes'

describe('/', () => {
  it('Provides health checks', async () => {
    const response = await getArchivist().get('/').expect(StatusCodes.OK)
    expect(response.body.data).toEqual({ alive: true })
  })
})
