import { XyoSchemaCache } from '@xyo-network/sdk-xyo-client-js'

import { getSchemaSchema } from '../model'
import { GetSchemaQueryHandler } from './GetSchemaQueryHandler'

const schema = getSchemaSchema

describe('GetSchemaQueryHandler', () => {
  describe('with valid schema', () => {
    it('returns the schema config', async () => {
      const name = 'network.xyo.schema'
      const sut = new GetSchemaQueryHandler({ schemaRepository: XyoSchemaCache.instance })
      const actual = await sut.handle({ name, schema })
      expect(actual).toBeTruthy()
      expect(actual?.payload).toBeTruthy()
      expect(actual?.payload.schema).toBe(name)
      expect(actual?.payload.definition).toBeTruthy()
    })
  })
  describe('with non-existent schema', () => {
    it('returns null', async () => {
      const name = 'network.xyo.foo'
      const sut = new GetSchemaQueryHandler({ schemaRepository: XyoSchemaCache.instance })
      const actual = await sut.handle({ name, schema })
      expect(actual).toBeNull()
    })
  })
})
