import 'source-map-support/register'

import { XyoBoundWitnessMeta, XyoBoundWitnessWithMeta, XyoBoundWitnessWithPartialMeta } from '@xyo-network/boundwitness'
import { XyoPayloadMeta, XyoPayloadWithMeta } from '@xyo-network/payload'

import { augmentWithMetadata } from '..'
import { removePayloads } from './removePayloads'

export interface PrepareBoundWitnessesResult {
  payloads: XyoPayloadWithMeta[]
  sanitized: XyoBoundWitnessWithMeta[]
}

export const prepareBoundWitnesses = (
  boundWitnesses: XyoBoundWitnessWithPartialMeta[],
  boundWitnessMetaData: XyoBoundWitnessMeta,
  payloadMetaData: XyoPayloadMeta,
): PrepareBoundWitnessesResult => {
  const sanitized: XyoBoundWitnessWithMeta[] = removePayloads(augmentWithMetadata(boundWitnesses, boundWitnessMetaData))
  const payloads: XyoPayloadWithMeta[] = augmentWithMetadata(
    boundWitnesses.map((bw) => bw._payloads || []).flatMap((p) => p),
    payloadMetaData,
  )
  return { payloads, sanitized }
}
