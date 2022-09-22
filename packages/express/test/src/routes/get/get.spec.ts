import { ReasonPhrases, StatusCodes } from 'http-status-codes'

import { request } from '../../testUtil'

describe('/', () => {
  it(`returns ${ReasonPhrases.OK}`, async () => {
    const result = await (await request()).get('/')
    expect(result.status).toBe(StatusCodes.OK)
    console.log(result.body.data)
  })
  it.skip('returns the address for the default module', async () => {
    const result = await (await request()).get('/')
    const { address } = result.body.data
    expect(address).toBeDefined()
    expect(address).toBeString()
  })
  it.skip('returns the supported queries for the default module', async () => {
    const result = await (await request()).get('/')
    const { queries } = result.body.data
    expect(queries).toBeDefined()
    expect(queries).toBeArray()
    const expected = queries as string[]
    expected.map((query) => {
      expect(query).toBeString()
    })
  })
})
