import { assertEx, delay } from '@xylabs/sdk-js'
import { XyoBoundWitnessBuilder, XyoPayload, XyoPayloadBuilder } from '@xyo-network/sdk-xyo-client-js'
import { StatusCodes } from 'http-status-codes'
import { v4 } from 'uuid'

import { debugSchema } from '../../model'
import { claimArchive, getArchivist, getTokenForNewUser, postCommandsToArchive, queryCommandResult } from '../../test'

const schema = debugSchema

const getTestRequest = (delay = 1): XyoPayload => {
  const fields = { delay, nonce: v4() }
  return new XyoPayloadBuilder({ schema }).fields(fields).build()
}

const postRequest = async (delay = 1, archive = 'temp', token?: string): Promise<string> => {
  const payload = getTestRequest(delay)
  const bw = new XyoBoundWitnessBuilder({ inlinePayloads: true }).payload(payload).build()
  const result = await postCommandsToArchive([bw], archive, token)
  const id = result?.[0]?.[0]
  expect(id).toBeDefined()
  return assertEx(id)
}

describe('/query/:hash', () => {
  let token: string
  let archive: string
  beforeAll(async () => {
    token = await getTokenForNewUser()
    archive = (await claimArchive(token)).archive
  })
  let id: string
  describe('for processing query', () => {
    beforeEach(async () => {
      id = await postRequest(10000, archive, token)
      await delay(100)
    })
    it('returns accepted', async () => {
      await getArchivist().get(`/query/${id}`).expect(StatusCodes.ACCEPTED)
    })
  })
  describe('for non-existent query', () => {
    beforeEach(() => {
      id = 'foo'
    })
    // NOTE: Skipping because we're running in-memory query processing and
    // we'll get mixed results until we use distributed state/transport
    it.skip('returns not found', async () => {
      await getArchivist().get(`/query/${id}`).expect(StatusCodes.NOT_FOUND)
    })
  })
  describe('for completed query', () => {
    beforeEach(async () => {
      id = await postRequest()
      await delay(100)
    })
    it('redirects to HURI', async () => {
      await getArchivist().get(`/query/${id}`).expect(StatusCodes.MOVED_TEMPORARILY)
    })
    it('returns query answer', async () => {
      const result = await queryCommandResult(id, token, StatusCodes.OK)
      expect(result).toBeTruthy()
      expect(result.schema).toBe(schema)
    })
  })
})
