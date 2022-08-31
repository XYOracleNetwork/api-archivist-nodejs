import { JobQueue } from '../Model'

export const startJobQueue = async (jobQueue: JobQueue) => {
  await jobQueue.start()
}
