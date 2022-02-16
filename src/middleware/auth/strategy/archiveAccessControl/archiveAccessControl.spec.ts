import { StatusCodes } from 'http-status-codes'

import { claimArchive, getArchivist, getTokenForNewUser, setArchiveAccessControl } from '../../../../test'

const verifyAnonymousRouteAccess = async (archive: string, expectedStatus: StatusCodes = StatusCodes.OK) => {
  await getArchivist().get(`/archive/${archive}/block/stats`).expect(expectedStatus)
}

const verifyAuthorizedRouteAccess = async (
  token: string,
  archive: string,
  expectedStatus: StatusCodes = StatusCodes.OK
) => {
  await getArchivist().get(`/archive/${archive}/block/stats`).auth(token, { type: 'bearer' }).expect(expectedStatus)
}

describe('ArchiveAccessControlAuthStrategy', () => {
  let token = ''
  let archive = ''
  beforeEach(async () => {
    token = await getTokenForNewUser()
    archive = (await claimArchive(token)).archive
  })
  it('Allows anonymous access to route if no access control specified', async () => {
    await verifyAuthorizedRouteAccess(token, archive)
    await verifyAnonymousRouteAccess(archive)
  })
  it('Allows anonymous access to route if access control specified as false', async () => {
    await setArchiveAccessControl(token, archive, { accessControl: false })
    await verifyAuthorizedRouteAccess(token, archive)
    await verifyAnonymousRouteAccess(archive)
  })
  it('Denys anonymous access to route if access control specified as true', async () => {
    await setArchiveAccessControl(token, archive, { accessControl: true })
    await verifyAuthorizedRouteAccess(token, archive)
    await verifyAnonymousRouteAccess(archive, StatusCodes.FORBIDDEN)
  })
})
