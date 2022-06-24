import { Query } from '../model'
import { IdentifiableHuri, InMemoryQueue } from '../Queue'

const queryQueue = new InMemoryQueue<Query>()
const responseQueue = new InMemoryQueue<IdentifiableHuri>()

// TODO: Replace with server-static globals (req.app)
export const getQueryQueue = () => {
  return queryQueue
}
export const getResponseQueue = () => {
  return responseQueue
}
