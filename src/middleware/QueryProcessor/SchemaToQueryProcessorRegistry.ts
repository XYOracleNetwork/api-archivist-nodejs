import { XyoPayload } from '@xyo-network/sdk-xyo-client-js'
import { Application } from 'express'

import { Optional, Query } from '../../model'
import { QueryProcessor } from './QueryProcessor'
import { QueryProcessorRegistry } from './QueryProcessorRegistry'

export class SchemaToQueryProcessorRegistry<T extends Query = Query, R extends Optional<XyoPayload> = Optional<XyoPayload>> implements QueryProcessorRegistry<T, R> {
  private _processors: Record<string, QueryProcessor<T, R>> = {}

  constructor(protected readonly app: Application) {}

  public get processors(): Readonly<Record<string, QueryProcessor<T, R>>> {
    return this._processors
  }

  public registerProcessorForSchema(schema: string, processor: QueryProcessor<T, R>) {
    this._processors[schema] = processor
  }
}
