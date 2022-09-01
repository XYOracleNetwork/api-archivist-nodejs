import { Job, JobProvider } from '@xyo-network/archivist-model'
import { TYPES } from '@xyo-network/archivist-types'
import { Container } from 'inversify'

export const getJobs = (container: Container): Job[] => {
  const boundWitnessStatsDiviner = container.get<JobProvider>(TYPES.BoundWitnessStatsDiviner)
  const payloadStatsDiviner = container.get<JobProvider>(TYPES.PayloadStatsDiviner)
  const archiveSchemaListDiviner = container.get<JobProvider>(TYPES.ArchiveSchemaListDiviner)
  const jobProviders = [archiveSchemaListDiviner, boundWitnessStatsDiviner, payloadStatsDiviner]
  return jobProviders.flatMap((provider) => provider.jobs)
}
