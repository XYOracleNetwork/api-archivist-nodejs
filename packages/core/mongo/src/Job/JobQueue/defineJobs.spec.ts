import { mock, MockProxy } from 'jest-mock-extended'

import { Job, JobQueue } from '../Model'
import { defineJobs } from './defineJobs'

describe('defineJobs', () => {
  let jobQueue: MockProxy<JobQueue>
  let jobs: Job[] = []
  beforeEach(() => {
    jobQueue = mock<JobQueue>()
    jobs = [mock<Job>()]
  })
  it('defines the supplied jobs', () => {
    defineJobs(jobQueue, jobs)
  })
})
