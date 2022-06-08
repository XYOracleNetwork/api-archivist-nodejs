import { XyoPayload } from '@xyo-network/sdk-xyo-client-js'

import { Optional, Query } from '../../model'
import { QueryProcessor } from './QueryProcessor'

export interface QueryProcessorRegistry<T extends Query = Query, R extends Optional<XyoPayload> = Optional<XyoPayload>> {
  processors: Readonly<Record<string, QueryProcessor<T, R>>>
  registerProcessorForSchema: (schema: string, processor: QueryProcessor<T, R>) => void
}
