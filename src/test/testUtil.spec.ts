import { Wallet } from 'ethers'
import { StatusCodes } from 'http-status-codes'
import supertest, { SuperTest, Test } from 'supertest'
import { v4 } from 'uuid'

import { IGetArchiveSettingsKeysResponse, IPostArchiveSettingsKeysResponse, IPutArchiveResponse } from '../archive'

test('Must have API_KEY ENV VAR defined', () => {
  expect(process.env.API_KEY).toBeTruthy()
})
test('Must have APP_PORT ENV VAR defined', () => {
  expect(process.env.APP_PORT).toBeTruthy()
})

const request = supertest(`http://localhost:${process.env.APP_PORT}`)

export interface ITestWeb2User {
  email: string
  password: string
}
export interface ITestWeb3User {
  address: string
  privateKey: string
}

export const getArchivist = (): SuperTest<Test> => {
  return supertest(`http://localhost:${process.env.APP_PORT}`)
}

export const getArchiveName = (): string => {
  return v4()
}

export const getNewWeb2User = (): ITestWeb2User => {
  const user = {
    email: `test-user-${v4()}@test.com`,
    password: 'password',
  }
  return user
}

export const getNewWeb3User = (): ITestWeb3User => {
  const wallet = Wallet.createRandom()
  const user = { address: wallet.address, privateKey: wallet.privateKey }
  return user
}

export const getExistingWeb2User = async (): Promise<ITestWeb2User> => {
  const apiKey = process.env.API_KEY as string
  const user = getNewWeb2User()
  await request.post('/user/signup').set('x-api-key', apiKey).send(user).expect(StatusCodes.OK)
  return user
}

export const signInWeb2User = async (user: ITestWeb2User): Promise<string> => {
  const tokenResponse = await request.post('/user/login').send(user).expect(StatusCodes.OK)
  return tokenResponse.body.token
}

export const getExistingWeb3User = async (): Promise<ITestWeb3User> => {
  const apiKey = process.env.API_KEY as string
  const user = getNewWeb3User()
  await request.post('/user/signup').set('x-api-key', apiKey).send({ address: user.address }).expect(StatusCodes.OK)
  return user
}

export const signInWeb3User = async (user: ITestWeb3User): Promise<string> => {
  const challengeResponse = await request.post('/user/wallet/challenge').send(user).expect(StatusCodes.OK)
  const { state } = challengeResponse.body
  const wallet = new Wallet(user.privateKey)
  const signature = await wallet.signMessage(state)
  const verifyBody = {
    address: wallet.address,
    message: state,
    signature,
  }
  const tokenResponse = await request.post('/user/wallet/verify').send(verifyBody).expect(StatusCodes.OK)
  return tokenResponse.body.token
}

export const getTokenForNewUser = async (): Promise<string> => {
  return signInWeb2User(await getExistingWeb2User())
}

export const claimArchive = async (token: string, archive?: string): Promise<IPutArchiveResponse> => {
  if (!archive) archive = getArchiveName()
  const response = await getArchivist()
    .put(`/archive/${archive}`)
    .auth(token, { type: 'bearer' })
    .expect(StatusCodes.OK)
  return response.body
}

export const createArchiveKey = async (token: string, archive: string): Promise<IPostArchiveSettingsKeysResponse> => {
  const response = await getArchivist()
    .post(`/archive/${archive}/settings/keys`)
    .auth(token, { type: 'bearer' })
    .expect(StatusCodes.OK)
  return response.body
}

export const getArchiveKeys = async (token: string, archive: string): Promise<IGetArchiveSettingsKeysResponse[]> => {
  const response = await getArchivist()
    .get(`/archive/${archive}/settings/keys`)
    .auth(token, { type: 'bearer' })
    .expect(StatusCodes.OK)
  return response.body
}
