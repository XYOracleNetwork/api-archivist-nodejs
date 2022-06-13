import 'source-map-support/register'

import { XyoBoundWitness, XyoPayload, XyoPayloadWrapper } from '@xyo-network/sdk-xyo-client-js'

export interface PrepareBoundWitnessesResult {
  payloads: XyoPayload[]
  sanitized: XyoBoundWitness[]
}

export const prepareBoundWitnesses = (
  boundWitnesses: XyoBoundWitness[],
  boundWitnessMetaData: Record<string, unknown>,
  payloadMetaData: Record<string, unknown>
): PrepareBoundWitnessesResult => {
  const sanitized = removePayloads(augmentWithMetadata(boundWitnesses, boundWitnessMetaData))
  const payloads = augmentWithMetadata(
    boundWitnesses.map((bw) => bw._payloads || []).flatMap((p) => p),
    payloadMetaData
  )
  return { payloads, sanitized }
}

export const removePayloads = (boundWitnesses: XyoBoundWitness[]): XyoBoundWitness[] => {
  return boundWitnesses.map((boundWitness) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _payloads, ...sanitized } = boundWitness
    return { ...sanitized }
  })
}

export const augmentWithMetadata = <T extends XyoPayload>(payloads: T[], payloadMetaData: Record<string, unknown>): T[] => {
  return payloads.map((payload) => {
    const wrapper = new XyoPayloadWrapper(payload)
    return { ...payload, ...payloadMetaData, _hash: wrapper.hash }
  })
}
