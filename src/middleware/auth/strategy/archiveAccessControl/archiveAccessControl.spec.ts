import { StatusCodes } from 'http-status-codes'

import { claimArchive, getArchivist, getTokenForNewUser, setArchiveAccessControl } from '../../../../test'

const verifyAnonymousRouteAccess = async (archive: string, expectedStatus: StatusCodes = StatusCodes.OK) => {
  await getArchivist().get(`/archive/${archive}/payload/recent`).expect(expectedStatus)
}

const verifyAuthorizedRouteAccess = async (token: string, archive: string, expectedStatus: StatusCodes = StatusCodes.OK) => {
  await getArchivist().get(`/archive/${archive}/payload/recent`).auth(token, { type: 'bearer' }).expect(expectedStatus)
}
describe('ArchiveAccessControlAuthStrategy', () => {
  let token = ''
  let archive = ''
  beforeEach(async () => {
    token = await getTokenForNewUser()
    const response = await claimArchive(token)
    expect(response.accessControl).toBe(false)
    archive = response.archive
  })
  it('Allows anonymous access to route if no access control specified', async () => {
    await verifyAuthorizedRouteAccess(token, archive)
    await verifyAnonymousRouteAccess(archive)
  })
  it('Allows anonymous access to route if access control specified as false', async () => {
    const response = await setArchiveAccessControl(token, archive, { accessControl: false, archive })
    expect(response.accessControl).toBe(false)
    await verifyAuthorizedRouteAccess(token, archive)
    await verifyAnonymousRouteAccess(archive)
  })
  it('Denys anonymous access to route if access control specified as true', async () => {
    const response = await setArchiveAccessControl(token, archive, { accessControl: true, archive })
    expect(response.accessControl).toBe(true)
    await verifyAuthorizedRouteAccess(token, archive)
    await verifyAnonymousRouteAccess(archive, StatusCodes.UNAUTHORIZED)
  })
  it('Denys access to route if access control specified as true and user not archive owner', async () => {
    const response = await setArchiveAccessControl(token, archive, { accessControl: true, archive })
    expect(response.accessControl).toBe(true)
    await verifyAuthorizedRouteAccess(await getTokenForNewUser(), archive, StatusCodes.FORBIDDEN)
    await verifyAnonymousRouteAccess(archive, StatusCodes.UNAUTHORIZED)
  })
})
