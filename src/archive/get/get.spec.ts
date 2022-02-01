import supertest from 'supertest'

jest.spyOn(console, 'log').mockImplementation(() => {
  // Keeping quiet
})

import { app } from '../../server'

it('Has health checks', async () => {
  const request = supertest(app)
  const response = await request.get('/')
  expect(response.body).toEqual({ alive: true })
})
