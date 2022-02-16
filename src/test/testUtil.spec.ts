import { XyoPayload } from '@xyo-network/sdk-xyo-client-js'
import { Wallet } from 'ethers'
import { StatusCodes } from 'http-status-codes'
import supertest, { SuperTest, Test } from 'supertest'
import { v4 } from 'uuid'

import {
  ArchiveResponse,
  GetArchiveSettingsKeysResponse,
  PayloadRepairHashResponse,
  PostArchiveBlockResponse,
  PostArchiveSettingsKeysResponse,
  PutArchiveRequest,
} from '../archive'

test('Must have API_KEY ENV VAR defined', () => {
  expect(process.env.API_KEY).toBeTruthy()
})
test('Must have APP_PORT ENV VAR defined', () => {
  expect(process.env.APP_PORT).toBeTruthy()
})

const request = supertest(`http://localhost:${process.env.APP_PORT}`)

export interface TestWeb2User {
  email: string
  password: string
}
export interface TestWeb3User {
  address: string
  privateKey: string
}

export const getArchivist = (): SuperTest<Test> => {
  return supertest(`http://localhost:${process.env.APP_PORT}`)
}

export const getArchiveName = (): string => {
  return v4()
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

export const getExistingWeb2User = async (): Promise<TestWeb2User> => {
  const apiKey = process.env.API_KEY as string
  const user = getNewWeb2User()
  await request.post('/user/signup').set('x-api-key', apiKey).send(user).expect(StatusCodes.OK)
  return user
}

export const signInWeb2User = async (user: TestWeb2User): Promise<string> => {
  const tokenResponse = await request.post('/user/login').send(user).expect(StatusCodes.OK)
  return tokenResponse.body.data.token
}

export const getExistingWeb3User = async (): Promise<TestWeb3User> => {
  const apiKey = process.env.API_KEY as string
  const user = getNewWeb3User()
  await request.post('/user/signup').set('x-api-key', apiKey).send({ address: user.address }).expect(StatusCodes.OK)
  return user
}

export const signInWeb3User = async (user: TestWeb3User): Promise<string> => {
  const challengeResponse = await request.post('/user/wallet/challenge').send(user).expect(StatusCodes.OK)
  const { state } = challengeResponse.body.data
  const wallet = new Wallet(user.privateKey)
  const signature = await wallet.signMessage(state)
  const verifyBody = {
    address: wallet.address,
    message: state,
    signature,
  }
  const tokenResponse = await request.post('/user/wallet/verify').send(verifyBody).expect(StatusCodes.OK)
  return tokenResponse.body.data.token
}

export const getTokenForNewUser = async (): Promise<string> => {
  return signInWeb2User(await getExistingWeb2User())
}

export const getArchives = async (
  token: string,
  expectedStatus: StatusCodes = StatusCodes.OK
): Promise<ArchiveResponse[]> => {
  const response = await getArchivist().get('/archive').auth(token, { type: 'bearer' }).expect(expectedStatus)
  return response.body.data
}

export const claimArchive = async (
  token: string,
  archive?: string,
  expectedStatus: StatusCodes = StatusCodes.OK
): Promise<ArchiveResponse> => {
  if (!archive) archive = getArchiveName()
  const response = await getArchivist()
    .put(`/archive/${archive}`)
    .auth(token, { type: 'bearer' })
    .expect(expectedStatus)
  return response.body.data
}

export const getArchive = async (
  token: string,
  archive: string,
  expectedStatus: StatusCodes = StatusCodes.OK
): Promise<ArchiveResponse> => {
  const response = await getArchivist()
    .get(`/archive/${archive}`)
    .auth(token, { type: 'bearer' })
    .expect(expectedStatus)
  return response.body.data
}

export const setArchiveAccessControl = async (
  token: string,
  archive: string,
  data: PutArchiveRequest = { accessControl: false },
  expectedStatus: StatusCodes = StatusCodes.OK
): Promise<ArchiveResponse> => {
  if (!archive) archive = getArchiveName()
  const response = await getArchivist()
    .put(`/archive/${archive}`)
    .auth(token, { type: 'bearer' })
    .send(data)
    .expect(expectedStatus)
  return response.body.data
}

export const createArchiveKey = async (
  token: string,
  archive: string,
  expectedStatus: StatusCodes = StatusCodes.OK
): Promise<PostArchiveSettingsKeysResponse> => {
  const response = await getArchivist()
    .post(`/archive/${archive}/settings/keys`)
    .auth(token, { type: 'bearer' })
    .expect(expectedStatus)
  return response.body.data
}

export const getArchiveKeys = async (
  token: string,
  archive: string,
  expectedStatus: StatusCodes = StatusCodes.OK
): Promise<GetArchiveSettingsKeysResponse> => {
  const response = await getArchivist()
    .get(`/archive/${archive}/settings/keys`)
    .auth(token, { type: 'bearer' })
    .expect(expectedStatus)
  return response.body.data
}

export const getPayload = () => {
  return {
    id: v4(),
    schema: 'test',
  }
}

export const getPayloads = (numPayloads: number) => {
  return new Array(numPayloads).fill(0).map(getPayload)
}

export const getNewBlock = (...payloads: Record<string, unknown>[]) => {
  return {
    boundWitnesses: [
      {
        _payloads: payloads ? payloads : ([] as Record<string, unknown>[]),
      },
    ],
  }
}

export const getNewBlockWithPayloads = (numPayloads = 1) => {
  return getNewBlock(...getPayloads(numPayloads))
}

export const getNewBlockWithBoundWitnesses = (numBoundWitnesses = 1) => {
  return {
    boundWitnesses: new Array(numBoundWitnesses).fill(0).map(() => {
      return { _payloads: [] as Record<string, unknown>[] }
    }),
  }
}

export const getNewBlockWithBoundWitnessesWithPayloads = (numBoundWitnesses = 1, numPayloads = 1) => {
  return {
    boundWitnesses: new Array(numBoundWitnesses).fill(0).map(() => {
      return { _payloads: getPayloads(numPayloads) }
    }),
  }
}

export const postBlock = async (
  data: Record<string, unknown>,
  archive: string,
  expectedStatus: StatusCodes = StatusCodes.OK
): Promise<PostArchiveBlockResponse> => {
  const response = await getArchivist().post(`/archive/${archive}/block`).send(data).expect(expectedStatus)
  return response.body.data
}

export const getBlockByHash = async (
  token: string,
  archive: string,
  hash: string,
  expectedStatus: StatusCodes = StatusCodes.OK
): Promise<XyoPayload[]> => {
  const response = await getArchivist()
    .get(`/archive/${archive}/block/hash/${hash}`)
    .auth(token, { type: 'bearer' })
    .expect(expectedStatus)
  return response.body.data
}

export const getPayloadByHash = async (
  token: string,
  archive: string,
  hash: string,
  expectedStatus: StatusCodes = StatusCodes.OK
): Promise<XyoPayload[]> => {
  const response = await getArchivist()
    .get(`/archive/${archive}/payload/hash/${hash}`)
    .auth(token, { type: 'bearer' })
    .expect(expectedStatus)
  return response.body.data
}

export const repairPayloadByHash = async (
  token: string,
  archive: string,
  hash: string,
  expectedStatus: StatusCodes = StatusCodes.OK
): Promise<PayloadRepairHashResponse> => {
  const response = await getArchivist()
    .get(`/archive/${archive}/payload/hash/${hash}/repair`)
    .auth(token, { type: 'bearer' })
    .expect(expectedStatus)
  return response.body.data
}

export const getPayloadByBlockHash = async (
  token: string,
  archive: string,
  hash: string,
  expectedStatus: StatusCodes = StatusCodes.OK
): Promise<XyoPayload[]> => {
  const response = await getArchivist()
    .get(`/archive/${archive}/block/hash/${hash}/payloads`)
    .auth(token, { type: 'bearer' })
    .expect(expectedStatus)
  return response.body.data
}
