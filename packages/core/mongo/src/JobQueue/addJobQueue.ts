import { JobQueue } from '@xyo-network/archivist-model'
import { TYPES } from '@xyo-network/archivist-types'
import { Container } from 'inversify'

import { getJobQueue } from './getJobQueue'

export const addDiviners = (container: Container) => {
  container.bind<JobQueue>(TYPES.JobQueue).toConstantValue(getJobQueue())
}
