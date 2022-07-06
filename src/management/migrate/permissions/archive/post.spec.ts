import { ForgetPromise } from '@xylabs/sdk-js'
import { XyoArchive } from '@xyo-network/sdk-xyo-client-js'
import { StatusCodes } from 'http-status-codes'

import { SetArchivePermissionsPayload } from '../../../../model'
import { claimArchive, getArchivist, getTokenForNewUser, setArchiveAccessControl } from '../../../../test'

interface MigrationResponse {
  archive: XyoArchive
  migrated: SetArchivePermissionsPayload
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
  beforeEach(async () => {
    token = await getTokenForNewUser()
    archive = await claimArchive(token)
  })
  it('Migrates a public archive', async () => {
    const result = await migrateArchive(archive.archive)
    expect(result.migrated?.addresses).toBeUndefined()
    expect(result.migrated?.schemas).toBeUndefined()
  })
  it('Migrates a private archive', async () => {
    archive.accessControl = true
    await setArchiveAccessControl(token, archive.archive, archive)
    const result = await migrateArchive(archive.archive)
    expect(result.migrated?.addresses?.allow).toEqual([])
    expect(result.migrated?.schemas).toBeUndefined()
  })
  afterAll(async () => {
    await ForgetPromise.awaitInactive()
  })
})
