import { Query, QueryProcessor, QueryProcessorRegistry } from '@xyo-network/archivist-model'
import { XyoPayloadWithPartialMeta } from '@xyo-network/sdk-xyo-client-js'

export class SchemaToQueryProcessorRegistry<T extends Query = Query, R extends XyoPayloadWithPartialMeta = XyoPayloadWithPartialMeta>
  implements QueryProcessorRegistry<T, R>
{
  private _processors: Record<string, QueryProcessor<T, R>> = {}

  public get processors(): Readonly<Record<string, QueryProcessor<T, R>>> {
    return this._processors
  }

  public registerProcessorForSchema(schema: string, processor: QueryProcessor<T, R>) {
    this._processors[schema] = processor
  }
}
