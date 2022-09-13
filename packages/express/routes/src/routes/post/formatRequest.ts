import { getRequestMeta } from '@xyo-network/archivist-express-lib'
import { augmentWithMetadata } from '@xyo-network/archivist-lib'
import {
  XyoBoundWitnessBuilder,
  XyoBoundWitnessBuilderConfig,
  XyoBoundWitnessWithMeta,
  XyoBoundWitnessWithPartialMeta,
} from '@xyo-network/boundwitness'
import { XyoPayloadWithPartialMeta } from '@xyo-network/payload'

import { PostNodeRequest } from './PostNodeRequest'

const config: XyoBoundWitnessBuilderConfig = { inlinePayloads: true }

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
        new XyoBoundWitnessBuilder(config).payload(x).build()
  })
  return augmentWithMetadata(
    boundWitnesses.map((bw) => {
      if (bw?._payloads && bw?._payloads?.length) bw._payloads = augmentWithMetadata(bw._payloads, payloadMeta)
      return bw
    }),
    boundWitnessMeta,
  )
}
