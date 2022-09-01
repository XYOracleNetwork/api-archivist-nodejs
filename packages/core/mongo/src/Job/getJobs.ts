import { Job, Task } from '@xyo-network/archivist-model'
import { TYPES } from '@xyo-network/archivist-types'
import { Container } from 'inversify'

interface TaskProvider {
  get task(): Task
}

const schedule = '1 minute'

export const getJobs = (container: Container): Job[] => {
  const boundWitnessStatsDiviner = container.get<TaskProvider>(TYPES.BoundWitnessStatsDiviner)
  const payloadStatsDiviner = container.get<TaskProvider>(TYPES.PayloadStatsDiviner)
  return [
    { name: 'boundWitnessStatsDiviner', schedule, task: boundWitnessStatsDiviner.task },
    { name: 'payloadStatsDiviner', schedule, task: payloadStatsDiviner.task },
  ]
}
