import { XyoPayload, XyoPayloadBuilder } from '@xyo-network/sdk-xyo-client-js'
import { StatusCodes } from 'http-status-codes'
import { v4 } from 'uuid'

import { debugSchema } from '../../model'
import { getArchivist } from '../../test'

const getTestRequest = (delay = 1): XyoPayload => {
  const schema = debugSchema
  const fields = { delay, nonce: v4() }
  return new XyoPayloadBuilder({ schema }).fields(fields).build()
}

const postRequest = (payload = getTestRequest(1)): Promise<XyoPayload> => {
  return Promise.resolve(payload)
}

describe('/query/:hash', () => {
  let payload: XyoPayload
  describe.skip('for processing query', () => {
    beforeEach(async () => {
      payload = await postRequest(getTestRequest(10000))
    })
    it('returns accepted', async () => {
      const sut = getArchivist()
      await sut.get(`/query/${payload._hash}`).expect(StatusCodes.ACCEPTED)
    })
  })
  describe('for non-existent query', () => {
    beforeEach(() => {
      payload = getTestRequest(1)
    })
    it('returns not found', async () => {
      const sut = getArchivist()
      await sut.get(`/query/${payload._hash}`).expect(StatusCodes.NOT_FOUND)
    })
  })
  describe.skip('for completed query', () => {
    beforeEach(async () => {
      payload = await postRequest()
    })
    it('redirects to HURI', async () => {
      const sut = getArchivist()
      await sut.get(`/query/${payload._hash}`).expect(StatusCodes.MOVED_TEMPORARILY)
    })
  })
})
