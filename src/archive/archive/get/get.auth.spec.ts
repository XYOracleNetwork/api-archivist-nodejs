import { ArchiveResponse } from '@xyo-network/sdk-xyo-client-js'
import { StatusCodes } from 'http-status-codes'

import { claimArchive, getArchive, getArchivist, getTokenForNewUser, setArchiveAccessControl } from '../../../test'

function getInvalidVersionOfToken(token: string) {
  const half = Math.floor(token.length / 2)
  return token.substring(0, half) + 'foo' + token.substring(half)
}

describe.skip('/archive/{:archive}', () => {
  describe('with public archive', () => {
    let archive = ''
    let token = ''
    beforeAll(async () => {
      // Create public archive
      token = await getTokenForNewUser()
      archive = (await claimArchive(token)).archive
      await setArchiveAccessControl(token, archive, { accessControl: false })
    })
    it('with token absent allows access', async () => {
      await getArchive(archive, undefined, StatusCodes.OK)
    })
    it('with token for user who owns the archive allows access', async () => {
      await getArchive(archive, token, StatusCodes.OK)
    })
    it('with token for user who does not own the archive allows access', async () => {
      const newToken = await getTokenForNewUser()
      await getArchive(archive, newToken, StatusCodes.OK)
    })
    it('with invalid token does not allow access', async () => {
      const newToken = getInvalidVersionOfToken(token)
      await getArchive(archive, newToken, StatusCodes.UNAUTHORIZED)
    })
  })
  describe('with private archive', () => {
    let archive = ''
    let token = ''
    beforeAll(async () => {
      // Create private archive
      token = await getTokenForNewUser()
      archive = (await claimArchive(token)).archive
      await setArchiveAccessControl(token, archive, { accessControl: true })
    })
    it('with token absent does not allow access', async () => {
      await getArchive(archive, undefined, StatusCodes.UNAUTHORIZED)
    })
    it('with token for user who owns the archive allows access', async () => {
      await getArchive(archive, token, StatusCodes.OK)
    })
    it('with token for user who does not own the archive does not allow access', async () => {
      const newToken = await getTokenForNewUser()
      await getArchive(archive, newToken, StatusCodes.OK)
    })
    it('with invalid token does not allow access', async () => {
      const newToken = getInvalidVersionOfToken(token)
      await getArchive(archive, newToken, StatusCodes.UNAUTHORIZED)
    })
  })
})
