import { ArchiveSchemaCountDiviner, ArchiveSchemaListDiviner, BoundWitnessStatsDiviner, PayloadStatsDiviner } from '@xyo-network/archivist-model'
import { TYPES } from '@xyo-network/archivist-types'
import { Container } from 'inversify'

import { MongoDBArchiveSchemaCountDiviner } from './ArchiveSchemaCount'
import { MongoDBArchiveSchemaListDiviner } from './ArchiveSchemaList'
import { MongoDBArchiveBoundWitnessStatsDiviner } from './BoundWitnessStats'
import { MongoDBArchivePayloadStatsDiviner } from './PayloadStats'

export const addDiviners = (container: Container) => {
  container.bind<ArchiveSchemaCountDiviner>(TYPES.ArchiveSchemaCountDiviner).to(MongoDBArchiveSchemaCountDiviner).inSingletonScope()
  container.bind<ArchiveSchemaListDiviner>(TYPES.ArchiveSchemaListDiviner).to(MongoDBArchiveSchemaListDiviner).inSingletonScope()
  container.bind<BoundWitnessStatsDiviner>(TYPES.BoundWitnessStatsDiviner).to(MongoDBArchiveBoundWitnessStatsDiviner).inSingletonScope()
  container.bind<PayloadStatsDiviner>(TYPES.PayloadStatsDiviner).to(MongoDBArchivePayloadStatsDiviner).inSingletonScope()
}
