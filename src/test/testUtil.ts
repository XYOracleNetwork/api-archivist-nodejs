import { PayloadRepairHashResponse } from '@xyo-network/archivist-archive'
import { SortDirection } from '@xyo-network/archivist-model'
import {
  XyoAccount,
  XyoArchive,
  XyoArchiveKey,
  XyoBoundWitness,
  XyoBoundWitnessBuilder,
  XyoBoundWitnessWithMeta,
  XyoDomainPayload,
  XyoPayload,
  XyoPayloadBuilder,
  XyoPayloadWithMeta,
  XyoPayloadWrapper,
  XyoSchemaPayload,
} from '@xyo-network/sdk-xyo-client-js'
import { config } from 'dotenv'
import { Wallet } from 'ethers'
import { StatusCodes } from 'http-status-codes'
import supertest, { SuperTest, Test } from 'supertest'
import { v4 } from 'uuid'

import { getApp } from '../server'

config()

const request = supertest(getApp())

const schema = 'co.coinapp.current.user.witness'
export const unitTestSigningAccount = new XyoAccount({ phrase: 'test' })
const payloadTemplate = {
  balance: 10000.0,
  daysOld: 1,
  deviceId: '77040732-4c6d-47e1-af15-06159b51d879',
  geomines: 1,
  planType: 'pro',
  schema,
  uid: '',
}

const knownPayload = new XyoPayloadBuilder({ schema })
  .fields({
    balance: 10000.0,
    daysOld: 1,
    deviceId: '00000000-0000-0000-0000-000000000000',
    geomines: 41453,
    planType: 'pro',
    schema: 'co.coinapp.current.user.witness',
    uid: '0000000000000000000000000000',
  })
  .build()
export const knownPayloadHash = new XyoPayloadWrapper(knownPayload).hash
export const knownBlock = new XyoBoundWitnessBuilder({ inlinePayloads: true }).witness(XyoAccount.random()).payload(knownPayload).build()
export const knownBlockHash = knownBlock._hash || ''

export interface TestWeb2User {
  email: string
  password: string
}
export interface TestWeb3User {
  address: string
  privateKey: string
}

export const getArchivist = (): SuperTest<Test> => {
  return supertest(getApp())
}

const testArchivePrefix = 'test-'
export const getArchiveName = (): string => {
  return `${testArchivePrefix}${v4()}`
}

export const testSchemaPrefix = 'network.xyo.schema.test.'
export const getSchemaName = (): string => {
  return `${testSchemaPrefix}${v4()}`
}

export const getNewWeb2User = (): TestWeb2User => {
  const user = {
    email: `test-user-${v4()}@test.com`,
    password: 'password',
  }
  return user
}

export const getNewWeb3User = (): TestWeb3User => {
  const wallet = Wallet.createRandom()
  const user = { address: wallet.address, privateKey: wallet.privateKey }
  return user
}

export const getExistingWeb2User = async (user: TestWeb2User = getNewWeb2User(), expectedStatus: StatusCodes = StatusCodes.CREATED): Promise<TestWeb2User> => {
  const apiKey = process.env.API_KEY as string
  await request.post('/user/signup').set('x-api-key', apiKey).send(user).expect(expectedStatus)
  return user
}

export const signInWeb2User = async (user: TestWeb2User): Promise<string> => {
  const tokenResponse = await request.post('/user/login').send(user).expect(StatusCodes.OK)
  return tokenResponse.body.data.token
}

export const getExistingWeb3User = async (expectedStatus: StatusCodes = StatusCodes.CREATED): Promise<TestWeb3User> => {
  const apiKey = process.env.API_KEY as string
  const user = getNewWeb3User()
  await request.post('/user/signup').set('x-api-key', apiKey).send({ address: user.address }).expect(expectedStatus)
  return user
}

export const signInWeb3User = async (user: TestWeb3User): Promise<string> => {
  const challengeResponse = await request.post(`/account/${user.address}/challenge`).send(user).expect(StatusCodes.OK)
  const { state } = challengeResponse.body.data
  const wallet = new Wallet(user.privateKey)
  const signature = await wallet.signMessage(state)
  const verifyBody = {
    address: wallet.address,
    message: state,
    signature,
  }
  const tokenResponse = await request.post(`/account/${wallet.address}/verify`).send(verifyBody).expect(StatusCodes.OK)
  return tokenResponse.body.data.token
}

export const getTokenForNewUser = async (): Promise<string> => {
  return signInWeb2User(await getExistingWeb2User())
}

export const invalidateToken = (token: string) => {
  const half = Math.floor(token.length / 2)
  return token.substring(0, half) + 'foo' + token.substring(half)
}

export const getArchives = async (token?: string, expectedStatus: StatusCodes = StatusCodes.OK): Promise<XyoArchive[]> => {
  const response = token ? await request.get('/archive').auth(token, { type: 'bearer' }).expect(expectedStatus) : await request.get('/archive').expect(expectedStatus)
  return response.body.data
}

export const claimArchive = async (token: string, archive?: string, expectedStatus: StatusCodes = StatusCodes.CREATED): Promise<XyoArchive> => {
  if (!archive) archive = getArchiveName()
  const response = await request.put(`/archive/${archive}`).auth(token, { type: 'bearer' }).expect(expectedStatus)
  return response.body.data
}

export const getArchive = async (archive: string, token?: string, expectedStatus: StatusCodes = StatusCodes.OK): Promise<XyoArchive> => {
  const path = `/archive/${archive}`
  const response = token ? await request.get(path).auth(token, { type: 'bearer' }).expect(expectedStatus) : await request.get(path).expect(expectedStatus)
  return response.body.data
}

export const getDomain = async (domain: string, token?: string, expectedStatus: StatusCodes = StatusCodes.OK): Promise<XyoDomainPayload> => {
  const path = `/domain/${domain}`
  const response = token ? await request.get(path).auth(token, { type: 'bearer' }).expect(expectedStatus) : await request.get(path).expect(expectedStatus)
  return response.body.data
}

export const setArchiveAccessControl = async (token: string, archive: string, data: XyoArchive, expectedStatus: StatusCodes = StatusCodes.OK): Promise<XyoArchive> => {
  if (!archive) archive = getArchiveName()
  const response = await request
    .put(`/archive/${archive}`)
    .auth(token, { type: 'bearer' })
    .send(data ?? { accessControl: false, archive })
    .expect(expectedStatus)
  return response.body.data
}

export const createArchiveKey = async (token: string, archive: string, expectedStatus: StatusCodes = StatusCodes.OK): Promise<XyoArchiveKey> => {
  const response = await request.post(`/archive/${archive}/settings/key`).auth(token, { type: 'bearer' }).expect(expectedStatus)
  return response.body.data
}

export const getArchiveKeys = async (token: string, archive: string, expectedStatus: StatusCodes = StatusCodes.OK): Promise<XyoArchiveKey[]> => {
  const response = await request.get(`/archive/${archive}/settings/key`).auth(token, { type: 'bearer' }).expect(expectedStatus)
  return response.body.data
}

export const getPayload = (): XyoPayload => {
  return new XyoPayloadBuilder({ schema })
    .fields({
      ...payloadTemplate,
      uid: v4(),
    })
    .build()
}

export const getPayloads = (numPayloads: number) => {
  return new Array(numPayloads).fill(0).map(getPayload)
}

export const getNewBlock = (...payloads: XyoPayload[]) => {
  return new XyoBoundWitnessBuilder({ inlinePayloads: true }).witness(unitTestSigningAccount).payloads(payloads).build()
}

export const getNewBlockWithPayloads = (numPayloads = 1) => {
  return getNewBlock(...getPayloads(numPayloads))
}

export const getNewBlockWithBoundWitnesses = (numBoundWitnesses = 1) => {
  return new Array(numBoundWitnesses).fill(0).map(() => {
    return new XyoBoundWitnessBuilder({ inlinePayloads: true }).witness(XyoAccount.random()).build()
  })
}

export const getNewBlockWithBoundWitnessesWithPayloads = (numBoundWitnesses = 1, numPayloads = 1) => {
  return new Array(numBoundWitnesses).fill(0).map(() => {
    return new XyoBoundWitnessBuilder({ inlinePayloads: true }).witness(XyoAccount.random()).payloads(getPayloads(numPayloads)).build()
  })
}

export const getHash = async (hash: string, token?: string, expectedStatus: StatusCodes = StatusCodes.OK): Promise<XyoBoundWitnessWithMeta | XyoPayloadWithMeta> => {
  const path = `/${hash}`
  const response = token ? await request.get(path).auth(token, { type: 'bearer' }).expect(expectedStatus) : await request.get(path).expect(expectedStatus)
  return response.body
}

export const postBlock = async (
  boundWitnesses: XyoBoundWitness | XyoBoundWitness[],
  archive: string,
  token?: string,
  expectedStatus: StatusCodes = StatusCodes.OK
): Promise<XyoBoundWitnessWithMeta[]> => {
  const data = ([] as XyoBoundWitness[]).concat(Array.isArray(boundWitnesses) ? boundWitnesses : [boundWitnesses])
  const path = `/archive/${archive}/block`
  const response = token ? await request.post(path).auth(token, { type: 'bearer' }).send(data).expect(expectedStatus) : await request.post(path).send(data).expect(expectedStatus)
  return response.body.data
}

export const getBlockByHash = async (token: string, archive: string, hash: string, expectedStatus: StatusCodes = StatusCodes.OK): Promise<XyoPayloadWithMeta[]> => {
  const response = await request.get(`/archive/${archive}/block/hash/${hash}`).auth(token, { type: 'bearer' }).expect(expectedStatus)
  return response.body.data
}

export const getBlocksByTimestamp = async (
  token: string,
  archive: string,
  timestamp: number,
  limit = 10,
  order: SortDirection = 'asc',
  expectedStatus: StatusCodes = StatusCodes.OK
): Promise<XyoBoundWitnessWithMeta[]> => {
  const response = await request.get(`/archive/${archive}/block`).query({ limit, order, timestamp }).auth(token, { type: 'bearer' }).expect(expectedStatus)
  return response.body.data
}

export const getRecentBlocks = async (archive: string, token?: string, expectedStatus: StatusCodes = StatusCodes.OK): Promise<XyoBoundWitnessWithMeta[]> => {
  const path = `/archive/${archive}/block/recent`
  const response = token ? await request.get(path).auth(token, { type: 'bearer' }).expect(expectedStatus) : await request.get(path).expect(expectedStatus)
  return response.body.data
}

export const getPayloadByHash = async (token: string, archive: string, hash: string, expectedStatus: StatusCodes = StatusCodes.OK): Promise<XyoPayloadWithMeta[]> => {
  const response = await request.get(`/archive/${archive}/payload/hash/${hash}`).auth(token, { type: 'bearer' }).expect(expectedStatus)
  return response.body.data
}

export const getPayloadsByTimestamp = async (
  token: string,
  archive: string,
  timestamp: number,
  limit = 10,
  order: SortDirection = 'asc',
  expectedStatus: StatusCodes = StatusCodes.OK
): Promise<XyoPayloadWithMeta[]> => {
  const response = await request.get(`/archive/${archive}/payload`).query({ limit, order, timestamp }).auth(token, { type: 'bearer' }).expect(expectedStatus)
  return response.body.data
}

export const repairPayloadByHash = async (token: string, archive: string, hash: string, expectedStatus: StatusCodes = StatusCodes.OK): Promise<PayloadRepairHashResponse> => {
  const response = await request.get(`/archive/${archive}/payload/hash/${hash}/repair`).auth(token, { type: 'bearer' }).expect(expectedStatus)
  return response.body.data
}

export const getRecentPayloads = async (archive: string, token?: string, expectedStatus: StatusCodes = StatusCodes.OK): Promise<XyoPayloadWithMeta[]> => {
  const path = `/archive/${archive}/payload/recent`
  const response = token ? await request.get(path).auth(token, { type: 'bearer' }).expect(expectedStatus) : await request.get(path).expect(expectedStatus)
  return response.body.data
}

export const getPayloadByBlockHash = async (token: string, archive: string, hash: string, expectedStatus: StatusCodes = StatusCodes.OK): Promise<XyoPayloadWithMeta[]> => {
  const response = await request.get(`/archive/${archive}/block/hash/${hash}/payloads`).auth(token, { type: 'bearer' }).expect(expectedStatus)
  return response.body.data
}

export const getSchema = async (schema: string, token?: string, expectedStatus: StatusCodes = StatusCodes.OK): Promise<XyoSchemaPayload> => {
  const path = `/schema/${schema}`
  const response = token ? await request.get(path).auth(token, { type: 'bearer' }).expect(expectedStatus) : await request.get(path).expect(expectedStatus)
  return response.body.data
}

export const getArchiveSchemaRecent = async (archive: string, token?: string, expectedStatus: StatusCodes = StatusCodes.OK): Promise<XyoPayloadWithMeta[]> => {
  const path = `/archive/${archive}/schema/recent`
  const response = token ? await request.get(path).auth(token, { type: 'bearer' }).expect(expectedStatus) : await request.get(path).expect(expectedStatus)
  return response.body.data
}

export const getArchiveSchemaPayloadsRecent = async (
  archive: string,
  schema: string,
  token?: string,
  expectedStatus: StatusCodes = StatusCodes.OK
): Promise<XyoPayloadWithMeta[]> => {
  const path = `/archive/${archive}/schema/${schema}/recent`
  const response = token ? await request.get(path).auth(token, { type: 'bearer' }).expect(expectedStatus) : await request.get(path).expect(expectedStatus)
  return response.body.data
}

export const postCommandsToArchive = async (
  commands: XyoBoundWitness[],
  archive: string,
  token?: string,
  expectedStatus: StatusCodes = StatusCodes.ACCEPTED
): Promise<string[][]> => {
  const path = `/${archive}`
  const response = token
    ? await request.post(path).send(commands).auth(token, { type: 'bearer' }).expect(expectedStatus)
    : await request.post(path).send(commands).expect(expectedStatus)
  return response.body.data
}

export const queryCommandResult = async (id: string, token?: string, expectedStatus: StatusCodes = StatusCodes.ACCEPTED): Promise<XyoPayloadWithMeta> => {
  const path = `/query/${id}`
  const response = token ? await request.get(path).redirects(1).auth(token, { type: 'bearer' }).expect(expectedStatus) : await request.get(path).redirects(1).expect(expectedStatus)
  // Redirects to raw HURI response so no .data
  return response.body
}
