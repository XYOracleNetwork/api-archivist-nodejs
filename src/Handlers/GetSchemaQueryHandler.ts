import { XyoSchemaCache, XyoSchemaCacheEntry, XyoSchemaNameToValidatorMap } from '@xyo-network/sdk-xyo-client-js'

import { GetSchema, QueryHandler } from '../model'

export interface GetSchemaQueryHandlerOpts {
  schemaRepository: XyoSchemaCache<XyoSchemaNameToValidatorMap>
}

export class GetSchemaQueryHandler implements QueryHandler<GetSchema, XyoSchemaCacheEntry | null | undefined> {
  constructor(protected readonly opts: GetSchemaQueryHandlerOpts) {}
  handle(command: GetSchema): Promise<XyoSchemaCacheEntry | null | undefined> {
    return this.opts.schemaRepository.get(command.name)
  }
}
