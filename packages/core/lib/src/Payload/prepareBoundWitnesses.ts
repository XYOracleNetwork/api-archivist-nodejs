import 'source-map-support/register'

import { XyoBoundWitnessMeta, XyoBoundWitnessWithMeta, XyoBoundWitnessWithPartialMeta } from '@xyo-network/boundwitness'
import { XyoPayloadMeta, XyoPayloadWithMeta, XyoPayloadWithPartialMeta, XyoPayloadWrapper } from '@xyo-network/payload'

export interface PrepareBoundWitnessesResult {
  payloads: XyoPayloadWithMeta[]
  sanitized: XyoBoundWitnessWithMeta[]
}

export const prepareBoundWitnesses = (
  boundWitnesses: XyoBoundWitnessWithPartialMeta[],
  boundWitnessMetaData: XyoBoundWitnessMeta,
  payloadMetaData: XyoPayloadMeta,
): PrepareBoundWitnessesResult => {
  const sanitized = removePayloads(augmentPayloadsWithMetadata(boundWitnesses, boundWitnessMetaData))
  const payloads = augmentPayloadsWithMetadata(
    boundWitnesses.map((bw) => bw._payloads || []).flatMap((p) => p),
    payloadMetaData,
  )
  return { payloads, sanitized }
}

export const removePayloads = (boundWitnesses: XyoBoundWitnessWithMeta[]): XyoBoundWitnessWithMeta[] => {
  return boundWitnesses.map((boundWitness) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _payloads, ...sanitized } = boundWitness
    return { ...sanitized }
  })
}

export const augmentBoundWitnessWithMetadata = <T extends XyoBoundWitnessWithPartialMeta>(
  boundWitnesses: T[],
  meta: XyoBoundWitnessMeta,
): XyoBoundWitnessWithMeta<T>[] => {
  return boundWitnesses.map((bw) => {
    const wrapper = new XyoPayloadWrapper(bw)
    return { ...bw, ...meta, _hash: wrapper.hash }
  })
}

export const augmentPayloadsWithMetadata = <T extends XyoPayloadWithPartialMeta>(payloads: T[], meta: XyoPayloadMeta): XyoPayloadWithMeta<T>[] => {
  return payloads.map((payload) => {
    const wrapper = new XyoPayloadWrapper(payload)
    return { ...payload, ...meta, _hash: wrapper.hash }
  })
}

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
