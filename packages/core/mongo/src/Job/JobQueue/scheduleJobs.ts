import { Job, JobQueue } from '../Model'

export const scheduleJobs = async (jobQueue: JobQueue, jobs: Job[]) => {
  await Promise.all(jobs.map(async (job) => await jobQueue.every(job.schedule, job.name)))
}
