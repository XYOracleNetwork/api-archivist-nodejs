import { XyoPayload } from '@xyo-network/sdk-xyo-client-js'
// eslint-disable-next-line import/no-named-as-default
import Ajv from 'ajv'

import { validatePayload } from './validatePayload'

const ajv = new Ajv()

const payloadSchema = {
  additionalProperties: true,
  properties: {
    schema: { type: 'string' },
  },
  required: ['schema'],
  type: 'object',
}
const validate = ajv.compile(payloadSchema)

const getPayload = (): XyoPayload => {
  return {
    schema: 'foo',
  }
}

describe('validatePayload', () => {
  describe('when validator exists', () => {
    it('and payload is valid against schema returns true', async () => {
      const payload = getPayload()
      const answer = await validatePayload(payload, () => Promise.resolve(validate))
      expect(answer).toBeTruthy()
    })
    it('and payload is not valid against schema returns false', async () => {
      const payload = getPayload()
      delete (payload as Partial<XyoPayload>).schema
      const answer = await validatePayload(payload, () => Promise.resolve(validate))
      expect(answer).toBeFalsy()
    })
  })
  describe('when validator does not exist', () => {
    it('returns true', async () => {
      const payload = getPayload()
      const answer = await validatePayload(payload, () => Promise.resolve(undefined))
      expect(answer).toBeTruthy()
    })
  })
})
