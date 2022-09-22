import { StatusCodes } from 'http-status-codes'

import { request } from '../../testUtil'

describe('/', () => {
  it('returns addresses on Node', async () => {
    const result = await (await request()).get('/')
    expect(result.status).toBe(StatusCodes.NOT_IMPLEMENTED)
  })
})
