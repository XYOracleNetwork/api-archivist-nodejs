import { XyoBoundWitness, XyoBoundWitnessWithMeta } from '@xyo-network/boundwitness'
import { StatusCodes } from 'http-status-codes'

import { request } from '../Server'

export const postBlock = async (
  boundWitnesses: XyoBoundWitness | XyoBoundWitness[],
  archive: string,
  token?: string,
  expectedStatus: StatusCodes = StatusCodes.OK,
): Promise<XyoBoundWitnessWithMeta[]> => {
  const data = ([] as XyoBoundWitness[]).concat(Array.isArray(boundWitnesses) ? boundWitnesses : [boundWitnesses])
  const path = `/archive/${archive}/block`
  const response = token
    ? await (await request()).post(path).auth(token, { type: 'bearer' }).send(data).expect(expectedStatus)
    : await (await request()).post(path).send(data).expect(expectedStatus)
  return response.body.data
}
