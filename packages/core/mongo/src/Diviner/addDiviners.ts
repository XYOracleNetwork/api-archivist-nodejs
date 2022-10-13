import {
  BoundWitnessDiviner,
  BoundWitnessStatsDiviner,
  LocationCertaintyDiviner,
  ModuleAddressDiviner,
  PayloadStatsDiviner,
  SchemaStatsDiviner,
} from '@xyo-network/archivist-model'
import { TYPES } from '@xyo-network/archivist-types'
import { Container } from 'inversify'

import { MongoDBBoundWitnessDiviner } from './BoundWitness'
import { MongoDBArchiveBoundWitnessStatsDiviner } from './BoundWitnessStats'
import { MongoDBLocationCertaintyDiviner } from './LocationCertainty'
import { MongoDBModuleAddressDiviner } from './ModuleAddress'
import { MongoDBArchivePayloadStatsDiviner } from './PayloadStats'
import { MongoDBArchiveSchemaStatsDiviner } from './SchemaStats'

export const addDiviners = (container: Container) => {
  container.bind<BoundWitnessDiviner>(TYPES.BoundWitnessStatsDiviner).to(MongoDBBoundWitnessDiviner).inSingletonScope()
  container.bind<BoundWitnessStatsDiviner>(TYPES.BoundWitnessStatsDiviner).to(MongoDBArchiveBoundWitnessStatsDiviner).inSingletonScope()
  container.bind<LocationCertaintyDiviner>(TYPES.ElevationDiviner).to(MongoDBLocationCertaintyDiviner).inSingletonScope()
  container.bind<ModuleAddressDiviner>(TYPES.ModuleAddressDiviner).to(MongoDBModuleAddressDiviner).inSingletonScope()
  container.bind<PayloadStatsDiviner>(TYPES.PayloadStatsDiviner).to(MongoDBArchivePayloadStatsDiviner).inSingletonScope()
  container.bind<SchemaStatsDiviner>(TYPES.SchemaStatsDiviner).to(MongoDBArchiveSchemaStatsDiviner).inSingletonScope()
}
