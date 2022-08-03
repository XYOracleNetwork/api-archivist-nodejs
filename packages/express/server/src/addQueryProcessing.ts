import { Logger } from '@xylabs/sdk-api-express-ecs'
import { assertEx } from '@xylabs/sdk-js'
import { dependencies } from '@xyo-network/archivist-dependencies'
import { QueryProcessorRegistry } from '@xyo-network/archivist-middleware'
import { Query, WitnessedPayloadArchivist } from '@xyo-network/archivist-model'
import { IdentifiableHuri, Queue } from '@xyo-network/archivist-queue'
import { TYPES } from '@xyo-network/archivist-types'
import { Huri, XyoQueryPayloadWithMeta } from '@xyo-network/sdk-xyo-client-js'

export const addQueryProcessing = () => {
  const logger = dependencies.get<Logger>(TYPES.Logger)
  const witnessedPayloadArchivist = dependencies.get<WitnessedPayloadArchivist>(TYPES.WitnessedPayloadArchivist)
  const queryQueue = dependencies.get<Queue<Query>>(TYPES.QueryQueue)
  const responseQueue = dependencies.get<Queue<IdentifiableHuri>>(TYPES.ResponseQueue)
  const queryProcessors = dependencies.get<QueryProcessorRegistry>(TYPES.SchemaToQueryProcessorRegistry)

  queryQueue.onQueued = async (id) => {
    const query = await queryQueue.tryDequeue(id)
    if (query) {
      try {
        const processor = queryProcessors.processors[query.payload.schema]
        if (processor) {
          // TODO: Validate auth (address/schema allowed)

          // Enqueue null in the response queue to indicate we're processing it
          await responseQueue.enqueue({ huri: null, id })
          const result = (await processor(query)) as XyoQueryPayloadWithMeta
          // TODO: Handle queries with no result
          if (result) {
            // TODO: A better way to communicate destination archive
            result._archive = assertEx(query.payload._archive)
            result._queryId = query.id
            result._timestamp = Date.now()

            // Witness result and store result in archive
            const stored = await witnessedPayloadArchivist.insert([result])
            const hash = stored?.[0]?._hash
            if (hash) {
              // Store result in response queue
              await responseQueue.enqueue({ huri: new Huri(hash), id })
            }
          }
        }
      } catch (error) {
        logger.log(error)
      }
    }
  }
}
