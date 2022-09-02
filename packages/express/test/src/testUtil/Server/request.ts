import { getApp } from '@xyo-network/archivist-server'
import supertest, { SuperTest, Test } from 'supertest'

export async function request(): Promise<SuperTest<Test>> {
  return supertest(await getApp())
}
