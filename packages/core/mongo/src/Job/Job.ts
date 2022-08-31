import { Task } from './Task'

export interface Job {
  name: string
  schedule: string
  task: Task
}
