import { Job, JobQueue } from '@xyo-network/archivist-model'
import { TYPES } from '@xyo-network/archivist-types'
import { Container } from 'inversify'

import { getJobs } from '../Job'
import { defineJobs } from './defineJobs'
import { getJobQueue } from './getJobQueue'
import { scheduleJobs } from './scheduleJobs'
import { startJobQueue } from './startJobQueue'

export const addDistributedJobs = async (jobQueue: JobQueue, jobs: Job[]) => {
  defineJobs(jobQueue, jobs)
  await startJobQueue(jobQueue)
  await scheduleJobs(jobQueue, jobs)
}

export const addJobQueue = async (container: Container) => {
  const jobQueue = getJobQueue()
  const jobs = getJobs(container)
  await addDistributedJobs(jobQueue, jobs)
  container.bind<JobQueue>(TYPES.JobQueue).toConstantValue(jobQueue)
}
