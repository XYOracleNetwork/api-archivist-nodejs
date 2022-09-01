import { SortDirection } from '@xyo-network/archivist-model'
import { getApp } from '@xyo-network/archivist-server'
import { XyoDomainPayload } from '@xyo-network/domain-payload-plugin'
import { XyoSchemaPayload } from '@xyo-network/schema-payload-plugin'
import { XyoArchive, XyoArchiveKey, XyoBoundWitness, XyoBoundWitnessWithMeta, XyoPayloadWithMeta } from '@xyo-network/sdk-xyo-client-js'
import { config } from 'dotenv'
import { StatusCodes } from 'http-status-codes'
import supertest, { SuperTest, Test } from 'supertest'

import { getArchiveName } from './Archive'
import { TestWeb2User } from './Model'
import { request } from './Server'
// eslint-disable-next-line deprecation/deprecation
import { getNewWeb2User } from './User'

config()

export const getArchivist = (): SuperTest<Test> => {
  return supertest(getApp())
}

/**
 * @deprecated Use getExistingUser instead
 */
export const getExistingWeb2User = async (
  // eslint-disable-next-line deprecation/deprecation
  user: TestWeb2User = getNewWeb2User(),
  expectedStatus: StatusCodes = StatusCodes.CREATED,
): Promise<TestWeb2User> => {
  const apiKey = process.env.API_KEY as string
  await (await request()).post('/user/signup').set('x-api-key', apiKey).send(user).expect(expectedStatus)
  return user
}

/**
 * @deprecated Use signInUser instead
 */
export const signInWeb2User = async (user: TestWeb2User): Promise<string> => {
  const tokenResponse = await (await request()).post('/user/login').send(user).expect(StatusCodes.OK)
  return tokenResponse.body.data.token
}

export const invalidateToken = (token: string) => {
  const half = Math.floor(token.length / 2)
  return token.substring(0, half) + 'foo' + token.substring(half)
}

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

export const getBlockByHash = async (
  token: string,
  archive: string,
  hash: string,
  expectedStatus: StatusCodes = StatusCodes.OK,
): Promise<XyoPayloadWithMeta[]> => {
  const response = await (await request()).get(`/archive/${archive}/block/hash/${hash}`).auth(token, { type: 'bearer' }).expect(expectedStatus)
  return response.body.data
}

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

export const getRecentBlocks = async (
  archive: string,
  token?: string,
  expectedStatus: StatusCodes = StatusCodes.OK,
): Promise<XyoBoundWitnessWithMeta[]> => {
  const path = `/archive/${archive}/block/recent`
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
