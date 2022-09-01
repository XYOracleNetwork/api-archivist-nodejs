import { XyoBoundWitnessBuilder } from '@xyo-network/boundwitness'

import { unitTestSigningAccount } from '../Account'
import { getPayloads } from '../Payload'

export const getNewBlockWithBoundWitnesses = (numBoundWitnesses = 1) => {
  return new Array(numBoundWitnesses).fill(0).map(() => {
    return new XyoBoundWitnessBuilder({ inlinePayloads: true }).witness(unitTestSigningAccount).build()
  })
}

export const getNewBlockWithBoundWitnessesWithPayloads = (numBoundWitnesses = 1, numPayloads = 1) => {
  return new Array(numBoundWitnesses).fill(0).map(() => {
    return new XyoBoundWitnessBuilder({ inlinePayloads: true }).witness(unitTestSigningAccount).payloads(getPayloads(numPayloads)).build()
  })
}
