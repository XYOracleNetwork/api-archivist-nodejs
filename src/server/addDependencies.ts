import { assertEx } from '@xylabs/sdk-js'
import { Huri, XyoPayload } from '@xyo-network/sdk-xyo-client-js'
import { Application } from 'express'

import {
  getAccountFromSeedPhrase,
  MongoDBArchivePermissionsPayloadPayloadRepository,
  MongoDBArchiveRepository,
  MongoDBArchivistWitnessedPayloadRepository,
  MongoDBUserManager,
  MongoDBUserRepository,
  SchemaToQueryProcessorRegistry,
  XyoPayloadToQueryConverterRegistry,
} from '../middleware'
import { Query } from '../model'
import { IdentifiableHuri, InMemoryQueue } from '../Queue'

const connectQueryQueueToResponseQueue = (app: Application) => {
  app.queryQueue.onQueued = async (id) => {
    const query = await app.queryQueue.tryDequeue(id)
    if (query) {
      const processor = app.queryProcessors.processors[query.payload.schema]
      if (processor) {
        // TODO: Validate auth (address/schema allowed)
        const result = await processor(query)
        if (result) {
          // TODO: Store result in archive
          // Store result in response queue
          const payload = result as XyoPayload
          const hash = assertEx(payload._hash)
          const huri = new Huri(hash)
          await app.responseQueue.enqueue({ huri, id: hash })
          // await app.responseQueue.enqueue()
        }
      }
    }
  }
}

export const addDependencies = (app: Application) => {
  const account = getAccountFromSeedPhrase(process.env.ACCOUNT_SEED)
  app.account = account
  app.archivistWitnessedPayloadRepository = new MongoDBArchivistWitnessedPayloadRepository(account)
  app.archiveRepository = new MongoDBArchiveRepository()
  app.archivePermissionsRepository = new MongoDBArchivePermissionsPayloadPayloadRepository()
  app.queryConverters = new XyoPayloadToQueryConverterRegistry(app)
  app.queryProcessors = new SchemaToQueryProcessorRegistry(app)
  app.queryQueue = new InMemoryQueue<Query>()
  app.responseQueue = new InMemoryQueue<IdentifiableHuri>()
  app.userManager = new MongoDBUserManager(new MongoDBUserRepository())

  // NOTE: Placeholder for distributed XyoPayload bus with persistence, etc.
  connectQueryQueueToResponseQueue(app)
}
