import 'source-map-support/register'

import { XyoBoundWitness, XyoPayload, XyoPayloadWrapper } from '@xyo-network/sdk-xyo-client-js'

import { flattenArray } from './flattenArray'

export interface PrepareBoundWitnessesResult {
  payloads: XyoPayload[]
  sanitized: XyoBoundWitness[]
}

export const prepareBoundWitnesses = (
  boundWitnesses: XyoBoundWitness[],
  boundWitnessMetaData: Record<string, unknown>,
  payloadMetaData: Record<string, unknown>
): PrepareBoundWitnessesResult => {
  const payloadLists: XyoPayload[][] = []
  const sanitized = boundWitnesses.map((boundWitness) => {
    const { _payloads, ...sanitized } = boundWitness
    payloadLists.push(_payloads ?? [])
    return { ...sanitized, ...boundWitnessMetaData }
  })
  const payloads = flattenArray(payloadLists).map((payload) => {
    const wrapper = new XyoPayloadWrapper(payload)
    return { ...payload, ...payloadMetaData, _hash: wrapper.sortedHash() }
  })
  return { payloads, sanitized }
}
