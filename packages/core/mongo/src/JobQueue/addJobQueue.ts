import { JobQueue } from '@xyo-network/archivist-model'
import { TYPES } from '@xyo-network/archivist-types'
import { ContainerModule, interfaces } from 'inversify'

import { getJobQueue } from './getJobQueue'

export const jobQueue = new ContainerModule((bind: interfaces.Bind) => {
  bind<JobQueue>(TYPES.JobQueue).toConstantValue(getJobQueue())
})
