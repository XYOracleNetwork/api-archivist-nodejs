import { Query } from '../../model'
import { QueryProcessor } from './QueryProcessor'

export interface QueryProcessorRegistry {
  processors: Readonly<Record<string, QueryProcessor>>
  registerProcessorForSchema: <T extends Query = Query, R = unknown>(schema: string, processor: QueryProcessor<T, R>) => void
}
