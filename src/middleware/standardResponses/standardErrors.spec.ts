import { XyoBoundWitness } from '@xyo-network/sdk-xyo-client-js'
import { StatusCodes } from 'http-status-codes'

import { claimArchive, getArchiveName, getArchivist, getTokenForNewUser, postBlock } from '../../test'

describe('standardErrors', () => {
  let token = ''
  let archive = ''
  beforeEach(async () => {
    token = await getTokenForNewUser()
    archive = getArchiveName()
    await claimArchive(token, archive)
  })
  it('Returns errors in the standard format', async () => {
    const data = 'no JSON' as unknown as XyoBoundWitness
    const response = await getArchivist().post(`/archive/${archive}/block`).send(data)
    const errors = response?.body?.errors
    expect(errors).toBeTruthy()
    expect(Array.isArray(errors)).toBe(true)
    expect(errors[0].detail).toBeTruthy()
    expect(errors[0].status).toBeTruthy()
  })
})
