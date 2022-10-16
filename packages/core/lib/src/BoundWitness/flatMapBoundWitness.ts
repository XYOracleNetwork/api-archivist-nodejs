import { XyoBoundWitnessWithPartialMeta } from '@xyo-network/archivist-model'
import { XyoBoundWitness } from '@xyo-network/boundwitness'
import { XyoPayload } from '@xyo-network/payload'

export type BoundWitnessMapResult = [Array<XyoBoundWitness>, Array<XyoPayload>]

export const flatMapBoundWitness = (boundWitness: XyoBoundWitnessWithPartialMeta): BoundWitnessMapResult => {
  const boundWitnesses: XyoBoundWitness[] = []
  const payloads: XyoPayload[] = []
  boundWitness._payloads?.map((payload) => {
    payloads.push(payload)
  })
  return [boundWitnesses, payloads]
}
