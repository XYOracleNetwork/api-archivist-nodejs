import { XyoBoundWitness } from '@xyo-network/sdk-xyo-client-js'

import { augmentWithMetadata, getRequestMeta } from '../lib'
import { PostNodeRequest } from './PostNodeRequest'

export const formatRequest = (req: PostNodeRequest): XyoBoundWitness[] => {
  const [boundWitnessMeta, payloadMeta] = getRequestMeta(req)
  const boundWitnesses: XyoBoundWitness[] = Array.isArray(req.body) ? req.body : [req.body]
  return augmentWithMetadata(
    boundWitnesses.map<XyoBoundWitness>((bw) => {
      bw._payloads = bw._payloads?.length ? augmentWithMetadata(bw._payloads, payloadMeta as Record<string, unknown>) : []
      return bw
    }),
    boundWitnessMeta
  )
}
