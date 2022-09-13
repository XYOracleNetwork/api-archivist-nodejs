import { XyoPayloadMeta, XyoPayloadWithMeta, XyoPayloadWithPartialMeta, XyoPayloadWrapper } from '@xyo-network/payload'

export const augmentPayloadsWithMetadata = <T extends XyoPayloadWithPartialMeta>(payloads: T[], meta: XyoPayloadMeta): XyoPayloadWithMeta<T>[] => {
  return payloads.map((payload) => {
    const wrapper = new XyoPayloadWrapper(payload)
    return { ...payload, ...meta, _hash: wrapper.hash }
  })
}
