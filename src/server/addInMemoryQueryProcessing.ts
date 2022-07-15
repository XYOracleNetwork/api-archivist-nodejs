import { Logger } from '@xylabs/sdk-api-express-ecs'
import { assertEx } from '@xylabs/sdk-js'
import { Huri, XyoQueryPayloadWithMeta } from '@xyo-network/sdk-xyo-client-js'
import { Application } from 'express'

import dependencies from '../inversify.config'
import { Query, WitnessedPayloadArchivist } from '../middleware'
import { IdentifiableHuri, Queue } from '../Queue'

export const addInMemoryQueryProcessing = (app: Application) => {
  const logger = dependencies.get<Logger>('Logger')
  const witnessedPayloadArchivist = dependencies.get<WitnessedPayloadArchivist>('ArchivistWitnessedPayloadRepository')
  const queryQueue = dependencies.get<Queue<Query>>('Queue<Query>')
  const responseQueue = dependencies.get<Queue<IdentifiableHuri>>('Queue<IdentifiableHuri>')

  queryQueue.onQueued = async (id) => {
    const query = await queryQueue.tryDequeue(id)
    if (query) {
      try {
        const processor = app.queryProcessors.processors[query.payload.schema]
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
