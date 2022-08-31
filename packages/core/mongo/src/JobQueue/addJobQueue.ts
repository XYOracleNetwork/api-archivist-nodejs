import { JobQueue } from '@xyo-network/archivist-model'
import { TYPES } from '@xyo-network/archivist-types'
import { Container } from 'inversify'

import { getJobs } from '../Job'
import { defineJobs } from './defineJobs'
import { getJobQueue } from './getJobQueue'
import { scheduleJobs } from './scheduleJobs'
import { startJobQueue } from './startJobQueue'

export const addDistributedJobs = async (jobQueue: JobQueue) => {
  const jobs = getJobs()
  defineJobs(jobQueue, jobs)
  await startJobQueue(jobQueue)
  await scheduleJobs(jobQueue, jobs)
}

export const addJobQueue = (container: Container) => {
  const jobQueue = getJobQueue()
  // TODO: await and enable async init of dependencies?
  void addDistributedJobs(jobQueue)
  container.bind<JobQueue>(TYPES.JobQueue).toConstantValue(jobQueue)
}
