import { GetDomainConfigQuery, getDomainConfigSchema } from '../model'
import { GetDomainConfigQueryHandler } from './GetDomainConfigQueryHandler'

const schema = getDomainConfigSchema
const domain = 'network.xyo'

describe('GetDomainConfigQueryHandler', () => {
  describe('With valid domain', () => {
    it('Returns the domain config', async () => {
      const sut = new GetDomainConfigQueryHandler()
      const actual = await sut.handle(new GetDomainConfigQuery({ domain, schema }))
      expect(actual).toBeTruthy()
      // TODO: Replace with const from SDK
      expect(actual?.schema).toBe('network.xyo.domain')
      expect(actual?.aliases).toBeDefined()
      expect(actual?.aliases?.['network.xyo.schema']).toBeDefined()
    })
  })
})
