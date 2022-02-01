import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import supertest from 'supertest'
import { v4 } from 'uuid'

const request = supertest(`http://localhost:${process.env.APP_PORT}`)

describe('/archive', () => {
  let token = ''
  let user: { email: string; password: string } = {
    email: '',
    password: '',
  }
  const apiKey = process.env.API_KEY as string
  beforeEach(async () => {
    user = {
      email: `test-user-${v4()}@test.com`,
      password: 'password',
    }
    await request.post('/user/signup').set('x-api-key', apiKey).send(user).expect(StatusCodes.OK)
    const tokenResponse = await request.post('/user/login').send(user).expect(StatusCodes.OK)
    token = tokenResponse.body.token
  })
  it('Allows the user to claim an unclaimed archive', async () => {
    const archive = v4()
    const response = await request.put(`/archive/${archive}`).auth(token, { type: 'bearer' }).expect(StatusCodes.OK)
    expect(response.body.archive).toEqual(archive)
  })
  it(`Returns ${ReasonPhrases.UNAUTHORIZED} if user claims an already claimed archive`, async () => {
    const archive = v4()
    const response = await request.put(`/archive/${archive}`).auth(token, { type: 'bearer' }).expect(StatusCodes.OK)
    expect(response.body.archive).toEqual(archive)
    const user2 = {
      email: `test-user-${v4()}@test.com`,
      password: 'password',
    }
    await request.post('/user/signup').set('x-api-key', apiKey).send(user2).expect(StatusCodes.OK)
    const tokenResponse = await request.post('/user/login').send(user2).expect(StatusCodes.OK)
    const user2token = tokenResponse.body.token
    await request.put(`/archive/${archive}`).auth(user2token, { type: 'bearer' }).expect(StatusCodes.UNAUTHORIZED)
  })
})
