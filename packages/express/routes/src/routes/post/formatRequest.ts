import { assertEx } from '@xylabs/assert'
import { getRequestMeta } from '@xyo-network/archivist-express-lib'
import { augmentWithMetadata } from '@xyo-network/archivist-lib'
import { XyoBoundWitnessSchema, XyoBoundWitnessWithMeta } from '@xyo-network/boundwitness'
import { XyoPayloadMeta, XyoPayloadWithMeta, XyoPayloadWrapper } from '@xyo-network/payload'

import { PostNodeRequest } from './PostNodeRequest'

export const formatRequest = (req: PostNodeRequest): XyoBoundWitnessWithMeta[] => {
  const [boundWitnessMeta, payloadMeta] = getRequestMeta(req)
  const allPayloads: XyoPayloadWithMeta[] = (Array.isArray(req.body) ? req.body : [req.body]) as XyoPayloadWithMeta[]

  const rawBoundWitnesses: XyoBoundWitnessWithMeta[] = allPayloads.filter(
    (payload) => payload.schema === XyoBoundWitnessSchema,
  ) as XyoBoundWitnessWithMeta[]

  const payloads: XyoPayloadWithMeta[] = allPayloads.filter((payload) => payload.schema !== XyoBoundWitnessSchema) as XyoBoundWitnessWithMeta[]

  const boundWitnesses = rawBoundWitnesses.map((boundWitness) => {
    if (!boundWitness._payloads) {
      boundWitness._payloads = []
      boundWitness.payload_hashes.forEach((hash) => {
        boundWitness._payloads?.push(
          assertEx(
            payloads.find((payload) => {
              return new XyoPayloadWrapper(payload).hash === hash
            }),
            `Missing Payloads [${hash}]`,
          ),
        )
      })
    }
    return boundWitness
  })

  return augmentWithMetadata(
    boundWitnesses.map<XyoBoundWitnessWithMeta>((bw) => {
      bw._payloads = bw._payloads?.length ? augmentWithMetadata(bw._payloads, payloadMeta as XyoPayloadMeta) : []
      return bw
    }),
    boundWitnessMeta,
  )
}
