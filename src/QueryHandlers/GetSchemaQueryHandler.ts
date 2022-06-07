import { XyoSchemaCache, XyoSchemaCacheEntry, XyoSchemaNameToValidatorMap } from '@xyo-network/sdk-xyo-client-js'

import { GetSchemaQuery, QueryHandler } from '../model'

export interface GetSchemaQueryHandlerOpts {
  schemaRepository: XyoSchemaCache<XyoSchemaNameToValidatorMap>
}

export class GetSchemaQueryHandler implements QueryHandler<GetSchemaQuery, XyoSchemaCacheEntry | null | undefined> {
  constructor(protected readonly opts: GetSchemaQueryHandlerOpts) {}
  handle(query: GetSchemaQuery): Promise<XyoSchemaCacheEntry | null | undefined> {
    return this.opts.schemaRepository.get(query.payload.name)
  }
}
