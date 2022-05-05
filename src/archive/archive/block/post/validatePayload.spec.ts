import { XyoPayload } from '@xyo-network/sdk-xyo-client-js'

import { validatePayload } from './validatePayload'

const payload: XyoPayload = {
  schema: 'foo',
}

describe('validatePayload', () => {
  describe('when validator exists', () => {
    it('and payload is valid against schema returns true', async () => {
      const answer = await validatePayload(payload)
      expect(answer).toBeTruthy()
    })
    it('and payload is not valid against schema returns false', async () => {
      const answer = await validatePayload(payload)
      expect(answer).toBeTruthy()
    })
  })
  describe('when validator does not exists', () => {
    it('returns true', async () => {
      const answer = await validatePayload(payload)
      expect(answer).toBeFalsy()
    })
  })
})
