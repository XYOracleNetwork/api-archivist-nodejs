import { Job } from '@xyo-network/archivist-model'
import { TYPES } from '@xyo-network/archivist-types'
import { Container } from 'inversify'

interface JobProvider {
  get jobs(): Job[]
}

export const getJobs = (container: Container): Job[] => {
  const boundWitnessStatsDiviner = container.get<JobProvider>(TYPES.BoundWitnessStatsDiviner)
  const payloadStatsDiviner = container.get<JobProvider>(TYPES.PayloadStatsDiviner)
  return [...boundWitnessStatsDiviner.jobs, ...payloadStatsDiviner.jobs]
}
