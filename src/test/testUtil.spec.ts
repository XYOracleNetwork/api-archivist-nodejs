import { StatusCodes } from 'http-status-codes'
import supertest, { SuperTest, Test } from 'supertest'
import { v4 } from 'uuid'

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
