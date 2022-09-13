import { XyoBoundWitnessMeta, XyoBoundWitnessWithMeta, XyoBoundWitnessWithPartialMeta } from '@xyo-network/boundwitness'
import { XyoPayloadWrapper } from '@xyo-network/payload'

export const augmentBoundWitnessesWithMetadata = <T extends XyoBoundWitnessWithPartialMeta>(
  boundWitnesses: T[],
  meta: XyoBoundWitnessMeta,
): XyoBoundWitnessWithMeta<T>[] => {
  return boundWitnesses.map((bw) => {
    const wrapper = new XyoPayloadWrapper(bw)
    return { ...bw, ...meta, _hash: wrapper.hash }
  })
}
