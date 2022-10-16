import { DebugPayload, DebugSchema } from '@xyo-network/archivist-model'
import { BoundWitnessBuilder, BoundWitnessBuilderConfig } from '@xyo-network/boundwitness'
import { XyoPayload, XyoPayloadBuilder } from '@xyo-network/payload'

import { flatMapBoundWitness } from './flatMapBoundWitness'

const config: BoundWitnessBuilderConfig = { inlinePayloads: true }

describe('flatMapBoundWitness', () => {
  const payload1: XyoPayload = new XyoPayloadBuilder<DebugPayload>({ schema: DebugSchema }).fields({ nonce: '1' }).build()
  const payload2: XyoPayload = new XyoPayloadBuilder<DebugPayload>({ schema: DebugSchema }).fields({ nonce: '2' }).build()
  it('with nested BoundWitnesses', () => {
    const inner = new BoundWitnessBuilder(config).payload(payload2).build()
    const outer = new BoundWitnessBuilder(config).payloads([payload1, inner[0]]).build()
    const result = flatMapBoundWitness(outer[0])
    expect(result).toBeObject()
    expect(result[0]).toContain(outer)
    expect(result[1]).toContain(payload1)
    expect(result[1]).toContain(payload2)
  })
})
