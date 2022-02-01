import { StatusCodes } from 'http-status-codes'
import supertest from 'supertest'

const request = supertest(`http://localhost:${process.env.APP_PORT}`)

describe('/', () => {
  it('Provides health checks', async () => {
    const response = await request.get('/').expect(StatusCodes.OK)
    expect(response.body).toEqual({ alive: true })
  })
})
