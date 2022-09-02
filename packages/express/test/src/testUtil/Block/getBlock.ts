import { assertEx } from '@xylabs/sdk-js'
import { XyoBoundWitnessBuilder } from '@xyo-network/boundwitness'
import { XyoPayload } from '@xyo-network/payload'

import { unitTestSigningAccount } from '../Account'
import { getPayloads, knownPayload } from '../Payload'

export const knownBlock = new XyoBoundWitnessBuilder({ inlinePayloads: true }).witness(unitTestSigningAccount).payload(knownPayload).build()
export const knownBlockHash = assertEx(knownBlock._hash)

export const getBlock = (...payloads: XyoPayload[]) => {
  return new XyoBoundWitnessBuilder({ inlinePayloads: true }).witness(unitTestSigningAccount).payloads(payloads).build()
}

export const getBlockWithPayloads = (numPayloads = 1) => {
  return getBlock(...getPayloads(numPayloads))
}
