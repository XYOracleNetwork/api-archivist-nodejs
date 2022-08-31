import { addJobs } from './addJobs'

describe('getJobs', () => {
  it('gets the jobs', () => {
    const jobs = addJobs()
    expect(jobs).toBeArray()
    expect(jobs.length).toBeGreaterThan(0)
  })
})
