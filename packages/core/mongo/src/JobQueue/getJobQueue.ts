import { assertEx } from '@xylabs/sdk-js'
import { JobQueue } from '@xyo-network/archivist-model'
import { Agenda } from 'agenda'

import { getName } from './getName'

/**
 * Collection to use for managing jobs
 */
const collection = 'node'

/**
 * DB to use for managing jobs
 */
const dbName = 'job'

const isLocalhost = (domain: string) => {
  const d = domain.toLowerCase()
  return d.includes('127.0.0.1') || d.includes('localhost')
}

export const getJobQueue = (): JobQueue => {
  const domain = assertEx(process.env.MONGO_DOMAIN, 'Missing Mongo Domain').toLowerCase()
  // TODO: Temp fix to match current ENV VAR format
  const dbDomain = isLocalhost(domain) ? domain : `${domain}.mongodb.net`
  const dbPassword = assertEx(process.env.MONGO_PASSWORD, 'Missing Mongo Password')
  const dbUserName = assertEx(process.env.MONGO_USERNAME, 'Missing Mongo Username')
  const address = `mongodb://${dbUserName}:${dbPassword}@${dbDomain}/${dbName}?authSource=admin`
  const db = { address, collection }
  const name = getName()
  const jobQueue = new Agenda({ db, name })

  // TODO: Depends on minimum job interval, set to 20 seconds for
  // default since we should never be running jobs faster than every minute
  const jobProcessingInterval = process.env.JOB_PROCESSING_INTERVAL || '20 seconds'
  jobQueue.processEvery(jobProcessingInterval)

  return jobQueue
}
