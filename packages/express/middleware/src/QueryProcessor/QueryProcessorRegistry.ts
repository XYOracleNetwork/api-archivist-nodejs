import { Query } from '@xyo-network/archivist-model'
import { XyoPayload } from '@xyo-network/sdk-xyo-client-js'

import { QueryProcessor } from './QueryProcessor'

export interface QueryProcessorRegistry<T extends Query = Query, R extends XyoPayload = XyoPayload> {
  processors: Readonly<Record<string, QueryProcessor<T, R>>>
  registerProcessorForSchema: (schema: string, processor: QueryProcessor<T, R>) => void
}
