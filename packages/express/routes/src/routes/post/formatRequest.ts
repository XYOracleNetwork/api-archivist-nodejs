import { getRequestMeta } from '@xyo-network/archivist-express-lib'
import { augmentWithMetadata } from '@xyo-network/archivist-lib'
import { XyoBoundWitnessWithMeta } from '@xyo-network/boundwitness'
import { XyoPayloadMeta } from '@xyo-network/payload'

import { PostNodeRequest } from './PostNodeRequest'

export const formatRequest = (req: PostNodeRequest): XyoBoundWitnessWithMeta[] => {
  const [boundWitnessMeta, payloadMeta] = getRequestMeta(req)
  const boundWitnesses: XyoBoundWitnessWithMeta[] = (Array.isArray(req.body) ? req.body : [req.body]) as XyoBoundWitnessWithMeta[]
  return augmentWithMetadata(
    boundWitnesses.map<XyoBoundWitnessWithMeta>((bw) => {
      bw._payloads = bw._payloads?.length ? augmentWithMetadata(bw._payloads, payloadMeta as XyoPayloadMeta) : []
      return bw
    }),
    boundWitnessMeta,
  )
}
