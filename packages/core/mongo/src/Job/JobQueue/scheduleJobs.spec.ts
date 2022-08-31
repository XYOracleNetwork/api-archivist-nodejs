import { mock, MockProxy } from 'jest-mock-extended'

import { Job, JobQueue } from '../Model'
import { scheduleJobs } from './scheduleJobs'

describe('scheduleJobs', () => {
  let jobQueue: MockProxy<JobQueue>
  let jobs: Job[] = []
  beforeEach(() => {
    jobQueue = mock<JobQueue>()
    jobs = [mock<Job>()]
  })
  it('schedules the supplied jobs', async () => {
    await scheduleJobs(jobQueue, jobs)
  })
})
