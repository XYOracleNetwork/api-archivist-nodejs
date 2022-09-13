import { XyoBoundWitnessMeta, XyoBoundWitnessWithMeta, XyoBoundWitnessWithPartialMeta } from '@xyo-network/boundwitness'
import { XyoPayloadMeta, XyoPayloadWithMeta, XyoPayloadWithPartialMeta, XyoPayloadWrapper } from '@xyo-network/payload'

export const augmentWithMetadata = <T extends XyoPayloadWithPartialMeta[] | XyoBoundWitnessWithPartialMeta[]>(
  payloads: T,
  meta: T extends XyoPayloadWithPartialMeta[] ? XyoPayloadMeta : XyoBoundWitnessMeta,
): T extends XyoPayloadWithPartialMeta ? XyoPayloadWithMeta[] : XyoBoundWitnessWithMeta[] => {
  return payloads.map((payload) => {
    const wrapper = new XyoPayloadWrapper(payload)
    return {
      ...payload,
      ...meta,
      _hash: wrapper.hash,
    } as T extends XyoPayloadWithPartialMeta ? XyoPayloadWithMeta : XyoBoundWitnessWithMeta
  })
}
