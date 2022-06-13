import { Huri, XyoPayload } from '@xyo-network/sdk-xyo-client-js'
import { Application } from 'express'

export const addInMemoryQueryProcessing = (app: Application) => {
  app.queryQueue.onQueued = async (id) => {
    const query = await app.queryQueue.tryDequeue(id)
    if (query) {
      const processor = app.queryProcessors.processors[query.payload.schema]
      if (processor) {
        // TODO: Validate auth (address/schema allowed)

        // Enqueue null in the response queue to indicate we're processing it
        await app.responseQueue.enqueue({ huri: null, id })
        const result = await processor(query)
        // TODO: Handle queries with no result
        if (result) {
          // TODO: A better way to communicate destination archive
          result._archive = query.payload._archive
          result._queryId = query.id
          result._timestamp = Date.now()

          // Witness result and store result in archive
          const stored = await app.archivistWitnessedPayloadRepository.insert([result as XyoPayload])
          const hash = stored?.[0]?._hash
          if (hash) {
            // Store result in response queue
            await app.responseQueue.enqueue({ huri: new Huri(hash), id })
          }
        }
      }
    }
  }
}
