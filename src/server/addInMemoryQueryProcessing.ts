import { Huri } from '@xyo-network/sdk-xyo-client-js'
import { Application } from 'express'

export const addInMemoryQueryProcessing = (app: Application) => {
  app.queryQueue.onQueued = async (id) => {
    const query = await app.queryQueue.tryDequeue(id)
    if (query) {
      const processor = app.queryProcessors.processors[query.payload.schema]
      if (processor) {
        // TODO: Validate auth (address/schema allowed)
        const result = await processor(query)
        const hash = result?._hash
        if (hash) {
          // TODO: Store result in archive
          // Store result in response queue
          await app.responseQueue.enqueue({ huri: new Huri(hash), id: hash })
        }
      }
    }
  }
}
