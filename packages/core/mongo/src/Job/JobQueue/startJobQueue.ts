import { JobQueue } from '@xyo-network/archivist-model'

export const startJobQueue = async (jobQueue: JobQueue) => {
  await jobQueue.start()
}
