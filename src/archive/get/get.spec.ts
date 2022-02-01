import supertest from 'supertest'

const request = supertest(`http://localhost:${process.env.APP_PORT}`)

it('Has health checks', async () => {
  const response = await request.get('/')
  expect(response.body).toEqual({ alive: true })
})
