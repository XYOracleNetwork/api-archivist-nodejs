import { validate } from 'uuid'

import { claimArchive, createArchiveKey, getTokenForNewUser } from '../../../../test'

const oneMinuteInMs = 1 * 60 * 1000

describe('/archive/:archive/settings/keys', () => {
  let token = ''
  let archive = ''
  beforeEach(async () => {
    token = await getTokenForNewUser()
    archive = (await claimArchive(token)).archive
  })
  it('Creates a key for the archive', async () => {
    const response = await createArchiveKey(token, archive)

    expect(response).toBeTruthy()

    const { created, key } = response

    expect(key).toBeTruthy()
    expect(validate(key)).toBeTruthy()

    expect(created).toBeTruthy()
    const createdDate = new Date(created)
    const now = new Date()
    expect(now.getTime() - createdDate.getTime()).toBeLessThan(oneMinuteInMs)
  })
  it('Allows multiple keys to be created for the archive', async () => {
    await createArchiveKey(token, archive)
    await createArchiveKey(token, archive)
  })
})
