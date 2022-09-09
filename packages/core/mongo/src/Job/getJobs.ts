import { Job, JobProvider } from '@xyo-network/archivist-model'
import { TYPES } from '@xyo-network/archivist-types'
import { Container } from 'inversify'

// TODO: We're peeking under the hood here and we should be
// doing something less knowledgeable than just constructing
// as list of known JobProviders
export const getJobs = (container: Container): Job[] => {
  const boundWitnessStatsDiviner = container.get<JobProvider>(TYPES.BoundWitnessStatsDiviner)
  const payloadStatsDiviner = container.get<JobProvider>(TYPES.PayloadStatsDiviner)
  const schemaStatsDiviner = container.get<JobProvider>(TYPES.SchemaStatsDiviner)
  const jobProviders = [schemaStatsDiviner, boundWitnessStatsDiviner, payloadStatsDiviner]
  return jobProviders.flatMap((provider) => provider.jobs)
}
