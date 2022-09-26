import { assertEx } from '@xylabs/assert'
import { XyoBoundWitnessWithPartialMeta, XyoPayloadWithPartialMeta } from '@xyo-network/archivist-model'
import { BoundWitnessBuilder, XyoBoundWitness } from '@xyo-network/boundwitness'
import { XyoPayload } from '@xyo-network/payload'

import { unitTestSigningAccount } from '../Account'
import { getPayloads, knownPayload } from '../Payload'

export const knownBlock = new BoundWitnessBuilder({ inlinePayloads: true })
  .witness(unitTestSigningAccount)
  .payload(knownPayload)
  .build() as XyoBoundWitness & XyoPayloadWithPartialMeta
export const knownBlockHash = assertEx(knownBlock._hash)

export const getBlock = (...payloads: XyoPayload[]): XyoBoundWitnessWithPartialMeta & XyoPayloadWithPartialMeta => {
  return new BoundWitnessBuilder({ inlinePayloads: true }).witness(unitTestSigningAccount).payloads(payloads).build()
}

export const getBlockWithPayloads = (numPayloads = 1) => {
  return getBlock(...getPayloads(numPayloads))
}
