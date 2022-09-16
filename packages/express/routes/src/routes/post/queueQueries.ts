import { exists } from '@xylabs/sdk-js'
import { XyoBoundWitnessWithMeta } from '@xyo-network/archivist-model'

import { PostNodeRequest } from './PostNodeRequest'

export const queueQueries = (boundWitnesses: XyoBoundWitnessWithMeta[], req: PostNodeRequest): Promise<string>[][] => {
  const { enqueue } = req.app.queryQueue
  const { converters } = req.app.queryConverters
  return boundWitnesses
    .map((bw) => bw._payloads)
    .filter(exists)
    .map((payloads) =>
      payloads
        .map((payload) => {
          const converter = converters[payload.schema]
          // TODO: Handle unsupported schema here
          return converter(payload, req)
        })
        .map(enqueue),
    )
}
