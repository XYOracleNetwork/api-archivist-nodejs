import {
  XyoAddress,
  XyoBoundWitness,
  XyoBoundWitnessBuilder,
  XyoPayload,
  XyoPayloadBuilder,
} from '@xyo-network/sdk-xyo-client-js'
import { Wallet } from 'ethers'
import { StatusCodes } from 'http-status-codes'
import supertest, { SuperTest, Test } from 'supertest'
import { v4 } from 'uuid'

import {
  ArchiveKeyResponse,
  ArchiveResponse,
  PayloadRepairHashResponse,
  PostArchiveBlockResponse,
  PutArchiveRequest,
} from '../archive'
import { SortOrder } from '../model'

test('Must have API_KEY ENV VAR defined', () => {
  expect(process.env.API_KEY).toBeTruthy()
})
test('Must have APP_PORT ENV VAR defined', () => {
  expect(process.env.APP_PORT).toBeTruthy()
})

const request = supertest(`http://localhost:${process.env.APP_PORT}`)

const schema = 'co.coinapp.current.user.witness'
const address = XyoAddress.fromPhrase('test')
const payloadTemplate = {
  balance: 10000.0,
  daysOld: 1,
  deviceId: '77040732-4c6d-47e1-af15-06159b51d879',
  geomines: 1,
  planType: 'pro',
  schema,
  uid: '',
}

// export const knownBlock = {
//   boundWitnesses: [
//     {
//       _payloads: [
//         {
//           balance: 10000.0,
//           daysOld: 1,
//           deviceId: '00000000-0000-0000-0000-000000000000',
//           geomines: 41453,
//           planType: 'pro',
//           schema: 'co.coinapp.current.user.witness',
//           uid: '0000000000000000000000000000',
//         },
//       ],
//     },
//   ],
// }
// export const knownPayloadHash = '9ba8f23d484191a50d7008e8bc93ef82e8253b66acf3e819cec7e39f17e4f1a8'
// export const knownBlockHash = '44136fa355b3678a1146ad16f7e8649e94fb4fc21fe77e8310c060f61caaff8a'

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
export const knownPayloadHash = knownPayload._hash || ''
export const knownBlock = new XyoBoundWitnessBuilder({ inlinePayloads: true }).payload(knownPayload).build()
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
): Promise<ArchiveKeyResponse> => {
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
): Promise<ArchiveKeyResponse[]> => {
  const response = await getArchivist()
    .get(`/archive/${archive}/settings/keys`)
    .auth(token, { type: 'bearer' })
    .expect(expectedStatus)
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
  return new XyoBoundWitnessBuilder({ inlinePayloads: true }).witness(address).payloads(payloads).build()
}

export const getNewBlockWithPayloads = (numPayloads = 1) => {
  return getNewBlock(...getPayloads(numPayloads))
}

export const getNewBlockWithBoundWitnesses = (numBoundWitnesses = 1) => {
  return new Array(numBoundWitnesses).fill(0).map(() => {
    return new XyoBoundWitnessBuilder({ inlinePayloads: true }).build()
  })
}

export const getNewBlockWithBoundWitnessesWithPayloads = (numBoundWitnesses = 1, numPayloads = 1) => {
  return new Array(numBoundWitnesses).fill(0).map(() => {
    return new XyoBoundWitnessBuilder({ inlinePayloads: true }).payloads(getPayloads(numPayloads)).build()
  })
}

export const postBlock = async (
  boundWitnesses: XyoBoundWitness | XyoBoundWitness[],
  archive: string,
  expectedStatus: StatusCodes = StatusCodes.OK
): Promise<PostArchiveBlockResponse> => {
  const data = ([] as XyoBoundWitness[]).concat(boundWitnesses)
  const response = await getArchivist()
    .post(`/archive/${archive}/block`)
    .send({ boundWitnesses: data })
    .expect(expectedStatus)
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

export const getBlocksByHash = async (
  token: string,
  archive: string,
  hash: string,
  limit = 10,
  order: SortOrder = 'asc',
  expectedStatus: StatusCodes = StatusCodes.OK
): Promise<XyoPayload[]> => {
  const response = await getArchivist()
    .get(`/archive/${archive}/block/hash/${hash}`)
    .query({ hash, limit, order })
    .auth(token, { type: 'bearer' })
    .expect(expectedStatus)
  return response.body.data
}

export const getRecentBlocks = async (
  token: string,
  archive: string,
  expectedStatus: StatusCodes = StatusCodes.OK
): Promise<XyoPayload[]> => {
  const response = await getArchivist()
    .get(`/archive/${archive}/block/recent`)
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
