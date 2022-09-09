import { BoundWitnessStatsDiviner, PayloadStatsDiviner, SchemaStatsDiviner } from '@xyo-network/archivist-model'
import { TYPES } from '@xyo-network/archivist-types'
import { Container } from 'inversify'

import { MongoDBArchiveBoundWitnessStatsDiviner } from './BoundWitnessStats'
import { MongoDBArchivePayloadStatsDiviner } from './PayloadStats'
import { MongoDBArchiveSchemaStatsDiviner } from './SchemaStats'

export const addDiviners = (container: Container) => {
  container.bind<BoundWitnessStatsDiviner>(TYPES.BoundWitnessStatsDiviner).to(MongoDBArchiveBoundWitnessStatsDiviner).inSingletonScope()
  container.bind<PayloadStatsDiviner>(TYPES.PayloadStatsDiviner).to(MongoDBArchivePayloadStatsDiviner).inSingletonScope()
  container.bind<SchemaStatsDiviner>(TYPES.SchemaStatsDiviner).to(MongoDBArchiveSchemaStatsDiviner).inSingletonScope()
}
