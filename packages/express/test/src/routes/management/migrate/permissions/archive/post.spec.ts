import { ForgetPromise } from '@xylabs/forget'
import { DebugPayload, debugSchema, SetArchivePermissionsPayload } from '@xyo-network/archivist-model'
import { XyoArchive, XyoBoundWitnessBuilder, XyoPayloadBuilder } from '@xyo-network/sdk-xyo-client-js'
import { StatusCodes } from 'http-status-codes'

import { claimArchive, getArchivist, getTokenForNewUser, postCommandsToArchive, setArchiveAccessControl } from '../../../../../testUtil'

interface MigrationResponse {
  archive: XyoArchive
  migrated: SetArchivePermissionsPayload
}

const schema = debugSchema

const postCommandToArchive = async (archive: string, token?: string, expectedStatus: StatusCodes = StatusCodes.ACCEPTED) => {
  const payload = new XyoPayloadBuilder<DebugPayload>({ schema }).build()
  const bw = new XyoBoundWitnessBuilder({ inlinePayloads: true }).payload(payload).build()
  await postCommandsToArchive([bw], archive, token, expectedStatus)
}

const migrateArchive = async (archive: string): Promise<MigrationResponse> => {
  const path = `/management/migrate/permissions/archives/${archive}`
  const header = { 'x-api-key': process.env.API_KEY }
  const response = await getArchivist().post(path).set(header).expect(StatusCodes.OK)
  const result: MigrationResponse = response.body.data
  expect(result).toBeDefined()
  expect(result.archive).toBeDefined()
  expect(result.archive.archive).toBe(archive)
  expect(result).toBeDefined()
  expect(result.migrated).toBeDefined()
  expect(result.migrated?.schemas).toBeUndefined()
  return result
}

describe('/management/migrate/permissions/archives/:archive', () => {
  let token: string
  let archive: XyoArchive
  describe('with public archive', () => {
    beforeAll(async () => {
      token = await getTokenForNewUser()
      archive = await claimArchive(token)
      const result = await migrateArchive(archive.archive)
      expect(result.migrated?.addresses).toBeUndefined()
      expect(result.migrated?.schemas).toBeUndefined()
    })
    it('allows owner archive access', async () => {
      await postCommandToArchive(archive.archive, token)
    })
    it('allows another user archive access', async () => {
      await postCommandToArchive(archive.archive, await getTokenForNewUser())
    })
    it('allows anonymous archive access', async () => {
      await postCommandToArchive(archive.archive, undefined)
    })
  })
  describe('with private archive', () => {
    beforeAll(async () => {
      token = await getTokenForNewUser()
      archive = await claimArchive(token)
      archive.accessControl = true
      await setArchiveAccessControl(token, archive.archive, archive)
      const result = await migrateArchive(archive.archive)
      expect(result.migrated?.addresses?.allow).toEqual([])
      expect(result.migrated?.schemas).toBeUndefined()
    })
    it('allows owner archive access', async () => {
      await postCommandToArchive(archive.archive, token)
    })
    it('disallows another user archive access', async () => {
      await postCommandToArchive(archive.archive, await getTokenForNewUser(), StatusCodes.FORBIDDEN)
    })
    it('disallows anonymous archive access', async () => {
      await postCommandToArchive(archive.archive, undefined, StatusCodes.UNAUTHORIZED)
    })
  })
  afterAll(async () => {
    await ForgetPromise.awaitInactive()
  })
})
