import { StatusCodes } from 'http-status-codes'

import { claimArchive, getArchivist, getNewBlock, getTokenForNewUser, postBlock } from '../../../../test'

describe('/archive/:archive/block/recent/:limit', () => {
  let token = ''
  let archive = ''
  beforeEach(async () => {
    token = await getTokenForNewUser()
    archive = (await claimArchive(token)).archive
  })
  it('With no argument, retrieves the 20 most recently posted blocks', async () => {
    const blocksPosted = 25
    for (let blockCount = 0; blockCount < blocksPosted; blockCount++) {
      const block = getNewBlock()
      const blockResponse = await postBlock(block, archive)
      expect(blockResponse.boundWitnesses).toBe(1)
    }
    const response = await getArchivist()
      .get(`/archive/${archive}/block/recent`)
      .auth(token, { type: 'bearer' })
      .expect(StatusCodes.OK)
    const recent = response.body.data
    expect(recent).toBeTruthy()
    expect(Array.isArray(recent)).toBe(true)
    expect(recent.length).toBe(20)
    recent.map((block: { _archive: string }) => {
      expect(block._archive).toBe(archive)
    })
  })
  it('Only retrieves recently posted blocks from the archive specified in the path', async () => {
    const blocksPosted = 25
    for (let blockCount = 0; blockCount < blocksPosted; blockCount++) {
      const block = getNewBlock()
      const blockResponse = await postBlock(block, archive)
      expect(blockResponse.boundWitnesses).toBe(1)
    }
    token = await getTokenForNewUser()
    archive = (await claimArchive(token)).archive
    const response = await getArchivist()
      .get(`/archive/${archive}/block/recent`)
      .auth(token, { type: 'bearer' })
      .expect(StatusCodes.OK)
    const recent = response.body.data
    expect(recent).toBeTruthy()
    expect(Array.isArray(recent)).toBe(true)
    expect(recent.length).toBe(0)
  })
  it('When no blocks have been posted to the archive, returns an empty array', async () => {
    const response = await getArchivist()
      .get(`/archive/${archive}/block/recent`)
      .auth(token, { type: 'bearer' })
      .expect(StatusCodes.OK)
    const recent = response.body.data
    expect(recent).toBeTruthy()
    expect(Array.isArray(recent)).toBe(true)
    expect(recent.length).toBe(0)
  })
})
