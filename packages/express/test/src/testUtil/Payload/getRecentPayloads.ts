import { XyoPayloadWithMeta } from '@xyo-network/archivist-model'
import { StatusCodes } from 'http-status-codes'

import { request } from '../Server'

export const getRecentPayloads = async (
  archive: string,
  token?: string,
  expectedStatus: StatusCodes = StatusCodes.OK,
): Promise<XyoPayloadWithMeta[]> => {
  const path = `/archive/${archive}/payload/recent`
  const response = token
    ? await (await request()).get(path).auth(token, { type: 'bearer' }).expect(expectedStatus)
    : await (await request()).get(path).expect(expectedStatus)
  return response.body.data
}
