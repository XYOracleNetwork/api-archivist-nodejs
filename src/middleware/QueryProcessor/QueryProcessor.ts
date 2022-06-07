import { Query } from '../../model'

export type QueryProcessor<T extends Query = Query, R = unknown> = (x: T) => Promise<R>
