import { Query } from '../model'
import { Transport } from './Transport'

export abstract class QueryQueue<T extends Query = Query> {
  public onQueryDequeued?: (id: string) => void
  public onQueryQueued?: (id: string) => void

  constructor(protected readonly queue: Transport<T>) {}

  public readonly enqueue = async (query: T) => {
    const id = await this.queue.enqueue(query)
    this.onQueryQueued?.(id)
    return id
  }

  /**
   * Tries to dequeue a query
   * @param id The id of the query to dequeue
   * @returns The query if it exists, null if it's
   * already been dequeue, undefined if it doesn't exist
   */
  public readonly tryDequeue = async (id: string) => {
    const query = await this.queue.get(id)
    if (query) {
      this.onQueryDequeued?.(id)
    }
    return query
  }
}
