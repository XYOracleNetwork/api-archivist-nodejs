import 'source-map-support/register'

import {
  XyoBoundWitnessMeta,
  XyoBoundWitnessWithMeta,
  XyoBoundWitnessWithPartialMeta,
  XyoPayloadMeta,
  XyoPayloadWithMeta,
} from '@xyo-network/archivist-model'

import { augmentWithMetadata } from './augmentWithMetadata'
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
