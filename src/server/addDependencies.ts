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
import { InMemoryQueue } from '../Queue'

export const addDependencies = (app: Application) => {
  const account = getAccountFromSeedPhrase(process.env.ACCOUNT_SEED)
  app.account = account
  app.archivistWitnessedPayloadRepository = new MongoDBArchivistWitnessedPayloadRepository(account)
  app.archiveRepository = new MongoDBArchiveRepository()
  app.archivePermissionsRepository = new MongoDBArchivePermissionsPayloadPayloadRepository()
  app.queryConverters = new XyoPayloadToQueryConverterRegistry(app)
  app.queryProcessors = new SchemaToQueryProcessorRegistry(app)
  app.queryQueue = new InMemoryQueue<Query>()
  app.responseQueue = new InMemoryQueue()
  app.queryQueue.onQueued = async (id) => {
    const query = await app.queryQueue.tryDequeue(id)
    if (query) {
      const processor = app.queryProcessors.processors[query.payload.schema]
      if (processor) {
        const result = await processor(query)
        if (result) {
          // TODO: Store result in response queue
        }
      }
    }
  }
  app.userManager = new MongoDBUserManager(new MongoDBUserRepository())
}
