import { SortDirection } from '@xyo-network/archivist-model'
import { XyoBoundWitnessWithMeta } from '@xyo-network/boundwitness'
import { StatusCodes } from 'http-status-codes'

import { request } from '../Server'

export const getBlocksByTimestamp = async (
  token: string,
  archive: string,
  timestamp: number,
  limit = 10,
  order: SortDirection = 'asc',
  expectedStatus: StatusCodes = StatusCodes.OK,
): Promise<XyoBoundWitnessWithMeta[]> => {
  const response = await (await request())
    .get(`/archive/${archive}/block`)
    .query({ limit, order, timestamp })
    .auth(token, { type: 'bearer' })
    .expect(expectedStatus)
  return response.body.data
}
