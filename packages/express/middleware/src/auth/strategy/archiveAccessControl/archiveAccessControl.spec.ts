import { claimArchive, getArchivist, getTokenForNewUser, setArchiveAccessControl } from '@xyo-network/archivist-test'
import { StatusCodes } from 'http-status-codes'

const attemptRoute = async (archive: string, token: string | undefined = undefined, expectedStatus: StatusCodes = StatusCodes.OK) => {
  return token
    ? await getArchivist().get(`/archive/${archive}/payload/recent`).auth(token, { type: 'bearer' }).expect(expectedStatus)
    : await getArchivist().get(`/archive/${archive}/payload/recent`).expect(expectedStatus)
}
describe('ArchiveAccessControlAuthStrategy', () => {
  let token = ''
  let archive = ''
  describe('when accessControl not specified', () => {
    beforeAll(async () => {
      token = await getTokenForNewUser()
      const response = await claimArchive(token)
      expect(response.accessControl).toBe(false)
      archive = response.archive
    })
    it('allows anonymous access', async () => {
      await attemptRoute(archive)
    })
    it('allows owner access', async () => {
      await attemptRoute(archive, token)
    })
    it('allows other user access', async () => {
      await attemptRoute(archive, await getTokenForNewUser())
    })
  })
  describe('when accessControl is false', () => {
    beforeAll(async () => {
      token = await getTokenForNewUser()
      const response = await claimArchive(token)
      expect(response.accessControl).toBe(false)
      archive = response.archive
      await setArchiveAccessControl(token, archive, { accessControl: false, archive })
    })
    it('allows anonymous access', async () => {
      await attemptRoute(archive)
    })
    it('allows owner access', async () => {
      await attemptRoute(archive, token)
    })
    it('allows other user access', async () => {
      await attemptRoute(archive, await getTokenForNewUser())
    })
  })
  describe('when accessControl is true', () => {
    beforeAll(async () => {
      token = await getTokenForNewUser()
      const response = await claimArchive(token)
      expect(response.accessControl).toBe(false)
      archive = response.archive
      await setArchiveAccessControl(token, archive, { accessControl: true, archive })
    })
    it('disallows anonymous access', async () => {
      await attemptRoute(archive, undefined, StatusCodes.UNAUTHORIZED)
    })
    it('allows owner access', async () => {
      await attemptRoute(archive, token)
    })
    it('disallows other user access', async () => {
      await attemptRoute(archive, await getTokenForNewUser(), StatusCodes.FORBIDDEN)
    })
  })
})
