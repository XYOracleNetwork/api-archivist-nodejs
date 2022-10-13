import { exists } from '@xylabs/sdk-js'
import { TYPES } from '@xyo-network/archivist-types'
import { Job, JobProvider } from '@xyo-network/shared'
import { Container } from 'inversify'

export const getJobs = (container: Container): Job[] => {
  return container
    .getAll<JobProvider>(TYPES.JobProvider)
    .flatMap((provider) => provider?.jobs)
    .filter(exists)
}
