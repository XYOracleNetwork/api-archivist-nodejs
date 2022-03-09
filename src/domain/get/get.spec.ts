import { getDomain, getTokenForNewUser } from '../../test'

const domain = 'network.xyo'

describe('/domain', () => {
  describe('when authorized returns', () => {
    let token = ''
    beforeEach(async () => {
      token = await getTokenForNewUser()
    })
    it('retrieve network.xyo', async () => {
      const response = await getDomain(domain, token)
      console.log(JSON.stringify(response, null, 2))
      expect(response.schema?.['network.xyo.schema']).toBeDefined()
    })
  })
  describe('when unauthorized returns', () => {
    it('retrieve network.xyo', async () => {
      const response = await getDomain(domain)
      console.log(JSON.stringify(response, null, 2))
      expect(response.schema?.['network.xyo.schema']).toBeDefined()
    })
  })
})
