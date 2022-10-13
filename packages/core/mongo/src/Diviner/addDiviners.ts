import {
  BoundWitnessDiviner,
  BoundWitnessStatsDiviner,
  LocationCertaintyDiviner,
  ModuleAddressDiviner,
  PayloadStatsDiviner,
  SchemaStatsDiviner,
} from '@xyo-network/archivist-model'
import { TYPES } from '@xyo-network/archivist-types'
import { JobProvider } from '@xyo-network/shared'
import { Container } from 'inversify'

import { MongoDBBoundWitnessDiviner } from './BoundWitness'
import { MongoDBArchiveBoundWitnessStatsDiviner } from './BoundWitnessStats'
import { MongoDBLocationCertaintyDiviner } from './LocationCertainty'
import { MongoDBModuleAddressDiviner } from './ModuleAddress'
import { MongoDBArchivePayloadStatsDiviner } from './PayloadStats'
import { MongoDBArchiveSchemaStatsDiviner } from './SchemaStats'

export const addDiviners = (container: Container) => {
  container.bind<BoundWitnessDiviner>(TYPES.BoundWitnessDiviner).to(MongoDBBoundWitnessDiviner).inSingletonScope()
  container.bind<JobProvider>(TYPES.JobProvider).toService(TYPES.BoundWitnessDiviner)

  container.bind<BoundWitnessStatsDiviner>(TYPES.BoundWitnessStatsDiviner).to(MongoDBArchiveBoundWitnessStatsDiviner).inSingletonScope()
  container.bind<JobProvider>(TYPES.JobProvider).toService(TYPES.BoundWitnessStatsDiviner)

  container.bind<LocationCertaintyDiviner>(TYPES.ElevationDiviner).to(MongoDBLocationCertaintyDiviner).inSingletonScope()
  container.bind<JobProvider>(TYPES.JobProvider).toService(TYPES.ElevationDiviner)

  container.bind<ModuleAddressDiviner>(TYPES.ModuleAddressDiviner).to(MongoDBModuleAddressDiviner).inSingletonScope()
  container.bind<JobProvider>(TYPES.JobProvider).toService(TYPES.ModuleAddressDiviner)

  container.bind<PayloadStatsDiviner>(TYPES.PayloadStatsDiviner).to(MongoDBArchivePayloadStatsDiviner).inSingletonScope()
  container.bind<JobProvider>(TYPES.JobProvider).toService(TYPES.PayloadStatsDiviner)

  container.bind<SchemaStatsDiviner>(TYPES.SchemaStatsDiviner).to(MongoDBArchiveSchemaStatsDiviner).inSingletonScope()
  container.bind<JobProvider>(TYPES.JobProvider).toService(TYPES.SchemaStatsDiviner)
}
