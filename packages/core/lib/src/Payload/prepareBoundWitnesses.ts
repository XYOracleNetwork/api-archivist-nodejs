import 'source-map-support/register'

import {
  XyoBoundWitnessMeta,
  XyoBoundWitnessWithMeta,
  XyoPayload,
  XyoPayloadMeta,
  XyoPayloadWithMeta,
  XyoPayloadWrapper,
} from '@xyo-network/sdk-xyo-client-js'

export interface PrepareBoundWitnessesResult {
  payloads: XyoPayloadWithMeta[]
  sanitized: XyoBoundWitnessWithMeta[]
}

export const prepareBoundWitnesses = (
  boundWitnesses: XyoBoundWitnessWithMeta[],
  boundWitnessMetaData: XyoBoundWitnessMeta,
  payloadMetaData: XyoPayloadMeta,
): PrepareBoundWitnessesResult => {
  const sanitized = removePayloads(augmentWithMetadata(boundWitnesses, boundWitnessMetaData))
  const payloads = augmentWithMetadata(
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

export const augmentWithMetadata = <T extends XyoPayload>(payloads: T[], payloadMetaData: XyoPayloadMeta): XyoPayloadWithMeta<T>[] => {
  return payloads.map((payload) => {
    const wrapper = new XyoPayloadWrapper(payload)
    return { ...payload, ...payloadMetaData, _hash: wrapper.hash }
  })
}
