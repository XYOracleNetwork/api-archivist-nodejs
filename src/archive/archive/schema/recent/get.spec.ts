import { XyoAccount, XyoBoundWitnessBuilder } from '@xyo-network/sdk-xyo-client-js'

import { claimArchive, getArchiveSchemaRecent, getTokenForNewUser, postBlock } from '../../../../test'

describe.skip('/archive/:archive/schema/recent', () => {
  const schema = 'network.xyo.schema'
  let token: string
  let archive: string
  beforeAll(async () => {
    token = await getTokenForNewUser()
    archive = (await claimArchive(token)).archive
    const definition = { $schema: 'http://json-schema.org/draft-07/schema#' }
    const bw = new XyoBoundWitnessBuilder({ inlinePayloads: true }).payload({ definition, schema }).witness(XyoAccount.random()).build()
    const response = await postBlock(bw, archive)
    expect(response).toBeTruthy()
  })
  it('Gets recently uploaded schema for the archive', async () => {
    const response = await getArchiveSchemaRecent(archive)
    expect(response).toBeTruthy()
  })
})
