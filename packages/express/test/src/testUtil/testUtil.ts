import { SortDirection } from '@xyo-network/archivist-model'
import { XyoBoundWitness, XyoBoundWitnessWithMeta } from '@xyo-network/boundwitness'
import { XyoDomainPayload } from '@xyo-network/domain-payload-plugin'
import { XyoPayloadWithMeta } from '@xyo-network/payload'
import { XyoSchemaPayload } from '@xyo-network/schema-payload-plugin'
import { XyoArchive, XyoArchiveKey } from '@xyo-network/sdk-xyo-client-js'
import { config } from 'dotenv'
import { StatusCodes } from 'http-status-codes'

import { getArchiveName } from './Archive'
import { request } from './Server'

config()

export const getArchives = async (token?: string, expectedStatus: StatusCodes = StatusCodes.OK): Promise<XyoArchive[]> => {
  const response = token
    ? await (await request()).get('/archive').auth(token, { type: 'bearer' }).expect(expectedStatus)
    : await (await request()).get('/archive').expect(expectedStatus)
  return response.body.data
}

export const claimArchive = async (token: string, archive?: string, expectedStatus: StatusCodes = StatusCodes.CREATED): Promise<XyoArchive> => {
  if (!archive) archive = getArchiveName()
  const response = await (await request()).put(`/archive/${archive}`).auth(token, { type: 'bearer' }).expect(expectedStatus)
  return response.body.data
}

export const getArchive = async (archive: string, token?: string, expectedStatus: StatusCodes = StatusCodes.OK): Promise<XyoArchive> => {
  const path = `/archive/${archive}`
  const response = token
    ? await (await request()).get(path).auth(token, { type: 'bearer' }).expect(expectedStatus)
    : await (await request()).get(path).expect(expectedStatus)
  return response.body.data
}

export const getDomain = async (domain: string, token?: string, expectedStatus: StatusCodes = StatusCodes.OK): Promise<XyoDomainPayload> => {
  const path = `/domain/${domain}`
  const response = token
    ? await (await request()).get(path).auth(token, { type: 'bearer' }).expect(expectedStatus)
    : await (await request()).get(path).expect(expectedStatus)
  return response.body.data
}

export const setArchiveAccessControl = async (
  token: string,
  archive: string,
  data: XyoArchive,
  expectedStatus: StatusCodes = StatusCodes.OK,
): Promise<XyoArchive> => {
  if (!archive) archive = getArchiveName()
  const response = await (
    await request()
  )
    .put(`/archive/${archive}`)
    .auth(token, { type: 'bearer' })
    .send({ accessControl: false, ...data, archive })
    .expect(expectedStatus)
  return response.body.data
}

export const createArchiveKey = async (token: string, archive: string, expectedStatus: StatusCodes = StatusCodes.OK): Promise<XyoArchiveKey> => {
  const response = await (await request()).post(`/archive/${archive}/settings/key`).auth(token, { type: 'bearer' }).expect(expectedStatus)
  return response.body.data
}

export const getArchiveKeys = async (token: string, archive: string, expectedStatus: StatusCodes = StatusCodes.OK): Promise<XyoArchiveKey[]> => {
  const response = await (await request()).get(`/archive/${archive}/settings/key`).auth(token, { type: 'bearer' }).expect(expectedStatus)
  return response.body.data
}

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

export const postCommandsToArchive = async (
  commands: XyoBoundWitness[],
  archive: string,
  token?: string,
  expectedStatus: StatusCodes = StatusCodes.ACCEPTED,
): Promise<string[][]> => {
  const path = `/${archive}`
  const response = token
    ? await (await request()).post(path).send(commands).auth(token, { type: 'bearer' }).expect(expectedStatus)
    : await (await request()).post(path).send(commands).expect(expectedStatus)
  return response.body.data
}

export const queryCommandResult = async (
  id: string,
  token?: string,
  expectedStatus: StatusCodes = StatusCodes.ACCEPTED,
): Promise<XyoPayloadWithMeta> => {
  const path = `/query/${id}`
  const response = token
    ? await (await request()).get(path).redirects(1).auth(token, { type: 'bearer' }).expect(expectedStatus)
    : await (await request()).get(path).redirects(1).expect(expectedStatus)
  // Redirects to raw HURI response so no .data
  return response.body
}
