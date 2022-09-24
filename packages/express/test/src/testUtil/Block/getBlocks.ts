import { XyoBoundWitnessWithPartialMeta, XyoPayloadWithPartialMeta } from '@xyo-network/archivist-model'
import { BoundWitnessBuilder } from '@xyo-network/boundwitness'

import { unitTestSigningAccount } from '../Account'
import { getPayloads } from '../Payload'

export const getBlocks = (numBoundWitnesses = 1): Array<XyoBoundWitnessWithPartialMeta & XyoPayloadWithPartialMeta> => {
  return new Array(numBoundWitnesses).fill(0).map(() => {
    return new BoundWitnessBuilder({ inlinePayloads: true }).witness(unitTestSigningAccount).build()
  })
}

export const getBlocksWithPayloads = (numBoundWitnesses = 1, numPayloads = 1): Array<XyoBoundWitnessWithPartialMeta & XyoPayloadWithPartialMeta> => {
  return new Array(numBoundWitnesses).fill(0).map(() => {
    return new BoundWitnessBuilder({ inlinePayloads: true }).witness(unitTestSigningAccount).payloads(getPayloads(numPayloads)).build()
  })
}
