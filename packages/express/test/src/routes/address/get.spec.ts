import { XyoAccount } from '@xyo-network/account'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'

import { request } from '../../testUtil'

describe('/:address', () => {
  const phrase = process.env.ACCOUNT_SEED
  const account = new XyoAccount({ phrase })
  const url = `/${account.addressValue.hex}`
  it(`returns ${ReasonPhrases.OK}`, async () => {
    const result = await (await request()).get(url)
    expect(result.status).toBe(StatusCodes.OK)
  })
  it('returns the address for the module', async () => {
    const result = await (await request()).get(url)
    const { address } = result.body.data
    expect(address).toBeDefined()
    expect(address).toBeString()
  })
  it('returns the supported queries for the module', async () => {
    const result = await (await request()).get(url)
    const { queries } = result.body.data
    expect(queries).toBeDefined()
    expect(queries).toBeArray()
    const expected = queries as string[]
    expected.map((query) => {
      expect(query).toBeString()
    })
  })
})
