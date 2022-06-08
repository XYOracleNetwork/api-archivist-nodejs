import { exists } from '@xylabs/sdk-js'
import { XyoBoundWitness, XyoBoundWitnessMeta, XyoPayload, XyoPayloadMeta, XyoPayloadWrapper } from '@xyo-network/sdk-xyo-client-js'

import { getRequestMetaData } from './getRequestMetaData'
import { PostNodeRequest } from './PostNodeRequest'

export const formatRequest = (req: PostNodeRequest): XyoBoundWitness[] => {
  const boundWitnessMetaData: XyoBoundWitnessMeta = getRequestMetaData(req)
  const payloadMetaData: XyoPayloadMeta = { _archive: boundWitnessMetaData._archive }
  const boundWitnesses: XyoBoundWitness[] = Array.isArray(req.body) ? req.body : [req.body]
  return boundWitnesses.map<XyoBoundWitness>((boundWitness) => {
    const bw: XyoBoundWitness = { ...boundWitness, ...boundWitnessMetaData }
    bw._payloads =
      bw._payloads?.filter(exists).map<XyoPayload>((payload) => {
        const wrapper = new XyoPayloadWrapper(payload)
        return { ...payload, ...payloadMetaData, _hash: wrapper.hash }
      }) || []
    return bw
  })
}
