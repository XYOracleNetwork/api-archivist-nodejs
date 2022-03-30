import { locationHeatmapAnswerSchema, XyoPayloadBuilder } from '@xyo-network/sdk-xyo-client-js'
import { readFile } from 'fs/promises'
import { join } from 'path'

import { getNewBlock, postBlock } from '../../test'

describe('jsonBodyParser', () => {
  it('Parses large JSON payloads using gzip', async () => {
    const schema = locationHeatmapAnswerSchema
    const file = join(__dirname, 'heatmap.json')
    const result = JSON.parse(await readFile(file, { encoding: 'utf-8' }))
    const payload = new XyoPayloadBuilder({ schema }).fields({ result }).build()
    const block = getNewBlock(payload)
    const response = await postBlock(block, 'temp')
    expect(response.length).toBe(1)
  })
})
