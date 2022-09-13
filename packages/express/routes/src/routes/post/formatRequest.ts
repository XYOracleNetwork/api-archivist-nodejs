import { getRequestMeta } from '@xyo-network/archivist-express-lib'
import { augmentBoundWitnessWithMetadata, augmentPayloadsWithMetadata } from '@xyo-network/archivist-lib'
import { XyoBoundWitnessBuilder, XyoBoundWitnessWithMeta, XyoBoundWitnessWithPartialMeta } from '@xyo-network/boundwitness'
import { XyoPayloadMeta, XyoPayloadWithPartialMeta } from '@xyo-network/payload'

import { PostNodeRequest } from './PostNodeRequest'

export const formatRequest = (req: PostNodeRequest): XyoBoundWitnessWithMeta[] => {
  const [boundWitnessMeta, payloadMeta] = getRequestMeta(req)
  // Make what we received an array
  const requestArray = (Array.isArray(req.body) ? req.body : [req.body]) as XyoPayloadWithPartialMeta[] | XyoBoundWitnessWithPartialMeta[]
  // Make what we received BoundWitnesses
  const boundWitnesses: XyoBoundWitnessWithPartialMeta[] = requestArray.map<XyoBoundWitnessWithPartialMeta>((x) => {
    return x.schema === 'network.xyo.boundwitness'
      ? (x as XyoBoundWitnessWithPartialMeta)
      : // NOTE: This is potentially inefficient as we could just be able
        // to process payloads. We're witnessing them here as the pipeline
        // expects BWs but if we can modify the pipeline to accept BWs or
        // Payloads we can remove this overhead.
        new XyoBoundWitnessBuilder({ inlinePayloads: true }).payload(x).build()
  })
  return augmentBoundWitnessWithMetadata(
    boundWitnesses.map((bw) => {
      bw._payloads = bw._payloads?.length ? augmentPayloadsWithMetadata(bw._payloads, payloadMeta as XyoPayloadMeta) : []
      return bw
    }),
    boundWitnessMeta,
  )
}
