import { StatusCodes } from 'http-status-codes'
import supertest from 'supertest'
import { v4 } from 'uuid'

const request = supertest(`http://localhost:${process.env.APP_PORT}`)

describe('/archive', () => {
  let token = ''
  let user: { email: string; password: string } = {
    email: '',
    password: '',
  }
  beforeEach(async () => {
    const apiKey = process.env.API_KEY as string
    user = {
      email: `test-user-${v4()}@test.com`,
      password: 'password',
    }
    await request.post('/user/signup').set('x-api-key', apiKey).send(user).expect(StatusCodes.OK)
    const tokenResponse = await request.post('/user/login').send(user).expect(StatusCodes.OK)
    token = tokenResponse.body.token
  })
  it('Returns the users archives', async () => {
    const archive = v4()
    await request.put(`/archive/${archive}`).auth(token, { type: 'bearer' }).expect(StatusCodes.OK)
    const response = await request.get('/archive').auth(token, { type: 'bearer' })
    expect(response.body).toEqual([archive])
  })
  it('Returns any empty array if the user owns no archives', async () => {
    const response = await request.get('/archive').auth(token, { type: 'bearer' })
    expect(response.body).toEqual([])
  })
})
