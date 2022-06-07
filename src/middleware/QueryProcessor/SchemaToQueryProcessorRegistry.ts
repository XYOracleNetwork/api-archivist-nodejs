import { Application } from 'express'

import { Query } from '../../model'
import { QueryProcessor } from './QueryProcessor'
import { QueryProcessorRegistry } from './QueryProcessorRegistry'

export class SchemaToQueryProcessorRegistry implements QueryProcessorRegistry {
  private _processors: Record<string, QueryProcessor> = {}

  constructor(protected readonly app: Application) {}

  public get processors(): Readonly<Record<string, QueryProcessor>> {
    return this._processors
  }

  public registerProcessorForSchema<T extends Query = Query, R = unknown>(schema: string, processor: QueryProcessor<T, R>) {
    this._processors[schema] = processor as QueryProcessor
  }
}
