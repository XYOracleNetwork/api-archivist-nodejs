import { getDomain, getTokenForNewUser } from '../../../testUtil'

const domain = 'network.xyo'

describe('/domain', () => {
  let token = ''
  beforeAll(async () => {
    token = await getTokenForNewUser()
  })
  describe('when authorized returns', () => {
    it('retrieve network.xyo', async () => {
      const response = await getDomain(domain, token)
      expect(response.aliases?.['network.xyo.schema']).toBeDefined()
    })
  })
  describe('when unauthorized returns', () => {
    it('retrieve network.xyo', async () => {
      const response = await getDomain(domain)
      expect(response.aliases?.['network.xyo.schema']).toBeDefined()
    })
  })
})
