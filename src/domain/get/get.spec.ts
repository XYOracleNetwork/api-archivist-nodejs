import { getDomain, getTokenForNewUser } from '../../test'

const domain = 'network.xyo'

describe('/domain', () => {
  describe('when authorized returns', () => {
    it('retrieve network.xyo', async () => {
      const response = await getDomain(domain, await getTokenForNewUser())
      expect(response.schema?.['network.xyo.schema']).toBeDefined()
    })
  })
  describe('when unauthorized returns', () => {
    it('retrieve network.xyo', async () => {
      const response = await getDomain(domain)
      expect(response.schema?.['network.xyo.schema']).toBeDefined()
    })
  })
})
