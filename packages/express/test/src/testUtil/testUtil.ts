import { SortDirection } from '@xyo-network/archivist-model'
import { XyoDomainPayload } from '@xyo-network/domain-payload-plugin'
import { XyoPayloadWithMeta } from '@xyo-network/payload'
import { XyoSchemaPayload } from '@xyo-network/schema-payload-plugin'
import { config } from 'dotenv'
import { StatusCodes } from 'http-status-codes'

import { request } from './Server'

config()

export const getDomain = async (domain: string, token?: string, expectedStatus: StatusCodes = StatusCodes.OK): Promise<XyoDomainPayload> => {
  const path = `/domain/${domain}`
  const response = token
    ? await (await request()).get(path).auth(token, { type: 'bearer' }).expect(expectedStatus)
    : await (await request()).get(path).expect(expectedStatus)
  return response.body.data
}

export const getPayloadByHash = async (
  token: string,
  archive: string,
  hash: string,
  expectedStatus: StatusCodes = StatusCodes.OK,
): Promise<XyoPayloadWithMeta[]> => {
  const response = await (await request()).get(`/archive/${archive}/payload/hash/${hash}`).auth(token, { type: 'bearer' }).expect(expectedStatus)
  return response.body.data
}

export const getPayloadsByTimestamp = async (
  token: string,
  archive: string,
  timestamp: number,
  limit = 10,
  order: SortDirection = 'asc',
  expectedStatus: StatusCodes = StatusCodes.OK,
): Promise<XyoPayloadWithMeta[]> => {
  const response = await (await request())
    .get(`/archive/${archive}/payload`)
    .query({ limit, order, timestamp })
    .auth(token, { type: 'bearer' })
    .expect(expectedStatus)
  return response.body.data
}

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

export const getPayloadByBlockHash = async (
  token: string,
  archive: string,
  hash: string,
  expectedStatus: StatusCodes = StatusCodes.OK,
): Promise<XyoPayloadWithMeta[]> => {
  const response = await (await request())
    .get(`/archive/${archive}/block/hash/${hash}/payloads`)
    .auth(token, { type: 'bearer' })
    .expect(expectedStatus)
  return response.body.data
}

export const getSchema = async (schema: string, token?: string, expectedStatus: StatusCodes = StatusCodes.OK): Promise<XyoSchemaPayload> => {
  const path = `/schema/${schema}`
  const response = token
    ? await (await request()).get(path).auth(token, { type: 'bearer' }).expect(expectedStatus)
    : await (await request()).get(path).expect(expectedStatus)
  return response.body.data
}

export const getArchiveSchemaRecent = async (
  archive: string,
  token?: string,
  expectedStatus: StatusCodes = StatusCodes.OK,
): Promise<XyoPayloadWithMeta[]> => {
  const path = `/archive/${archive}/schema/recent`
  const response = token
    ? await (await request()).get(path).auth(token, { type: 'bearer' }).expect(expectedStatus)
    : await (await request()).get(path).expect(expectedStatus)
  return response.body.data
}

export const getArchiveSchemaPayloadsRecent = async (
  archive: string,
  schema: string,
  token?: string,
  expectedStatus: StatusCodes = StatusCodes.OK,
): Promise<XyoPayloadWithMeta[]> => {
  const path = `/archive/${archive}/schema/${schema}/recent`
  const response = token
    ? await (await request()).get(path).auth(token, { type: 'bearer' }).expect(expectedStatus)
    : await (await request()).get(path).expect(expectedStatus)
  return response.body.data
}
