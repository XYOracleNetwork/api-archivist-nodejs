import { XyoBoundWitnessWithMeta } from '@xyo-network/archivist-model'
import { XyoPayloadWithMeta } from '@xyo-network/payload'
import { StatusCodes } from 'http-status-codes'

import { request } from '../Server'

export const getHash = async (
  hash: string,
  token?: string,
  expectedStatus: StatusCodes = StatusCodes.OK,
): Promise<XyoBoundWitnessWithMeta | XyoPayloadWithMeta> => {
  const path = `/${hash}`
  const response = token
    ? await (await request()).get(path).auth(token, { type: 'bearer' }).expect(expectedStatus)
    : await (await request()).get(path).expect(expectedStatus)
  return response.body
}
