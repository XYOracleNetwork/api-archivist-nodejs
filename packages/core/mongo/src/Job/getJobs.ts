import { TYPES } from '@xyo-network/archivist-types'
import { Job, JobProvider } from '@xyo-network/shared'
import { Container } from 'inversify'

// TODO: We're peeking under the hood here and we should be
// doing something less knowledgeable than just constructing
// as list of known JobProviders
export const getJobs = (container: Container): Job[] => {
  const boundWitnessStatsDiviner = container.get<JobProvider>(TYPES.BoundWitnessStatsDiviner)
  const elevationDiviner = container.get<JobProvider>(TYPES.ElevationDiviner)
  const moduleAddressDiviner = container.get<JobProvider>(TYPES.ModuleAddressDiviner)
  const payloadStatsDiviner = container.get<JobProvider>(TYPES.PayloadStatsDiviner)
  const schemaStatsDiviner = container.get<JobProvider>(TYPES.SchemaStatsDiviner)
  const jobProviders = [boundWitnessStatsDiviner, elevationDiviner, moduleAddressDiviner, schemaStatsDiviner, payloadStatsDiviner]
  return jobProviders.flatMap((provider) => provider.jobs)
}
