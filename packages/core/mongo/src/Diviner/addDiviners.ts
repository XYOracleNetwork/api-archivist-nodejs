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
import { MongoDBPayloadDiviner } from './Payload'
import { MongoDBArchivePayloadStatsDiviner } from './PayloadStats'
import { MongoDBArchiveSchemaStatsDiviner } from './SchemaStats'

export const addDiviners = (container: Container) => {
  container.bind(MongoDBBoundWitnessDiviner).toSelf().inSingletonScope()
  container.bind<BoundWitnessDiviner>(TYPES.BoundWitnessDiviner).toService(MongoDBBoundWitnessDiviner)
  container.bind<JobProvider>(TYPES.JobProvider).toService(MongoDBBoundWitnessDiviner)

  container.bind(MongoDBArchiveBoundWitnessStatsDiviner).toSelf().inSingletonScope()
  container.bind<BoundWitnessStatsDiviner>(TYPES.BoundWitnessStatsDiviner).toService(MongoDBArchiveBoundWitnessStatsDiviner)
  container.bind<JobProvider>(TYPES.JobProvider).toService(MongoDBArchiveBoundWitnessStatsDiviner)

  container.bind(MongoDBLocationCertaintyDiviner).toSelf().inSingletonScope()
  container.bind<LocationCertaintyDiviner>(TYPES.ElevationDiviner).toService(MongoDBLocationCertaintyDiviner)
  container.bind<JobProvider>(TYPES.JobProvider).toService(MongoDBLocationCertaintyDiviner)

  container.bind(MongoDBModuleAddressDiviner).toSelf().inSingletonScope()
  container.bind<ModuleAddressDiviner>(TYPES.ModuleAddressDiviner).toService(MongoDBModuleAddressDiviner)
  container.bind<JobProvider>(TYPES.JobProvider).toService(MongoDBModuleAddressDiviner)

  container.bind(MongoDBPayloadDiviner).toSelf().inSingletonScope()
  container.bind<BoundWitnessDiviner>(TYPES.PayloadDiviner).toService(MongoDBPayloadDiviner)
  container.bind<JobProvider>(TYPES.JobProvider).toService(MongoDBPayloadDiviner)

  container.bind(MongoDBArchivePayloadStatsDiviner).toSelf().inSingletonScope()
  container.bind<PayloadStatsDiviner>(TYPES.PayloadStatsDiviner).toService(MongoDBArchivePayloadStatsDiviner)
  container.bind<JobProvider>(TYPES.JobProvider).toService(MongoDBArchivePayloadStatsDiviner)

  container.bind(MongoDBArchiveSchemaStatsDiviner).toSelf().inSingletonScope()
  container.bind<SchemaStatsDiviner>(TYPES.SchemaStatsDiviner).toService(MongoDBArchiveSchemaStatsDiviner)
  container.bind<JobProvider>(TYPES.JobProvider).toService(MongoDBArchiveSchemaStatsDiviner)
}
