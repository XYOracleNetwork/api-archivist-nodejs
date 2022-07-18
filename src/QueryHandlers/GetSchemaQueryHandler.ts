import { XyoSchemaCache, XyoSchemaNameToValidatorMap, XyoSchemaPayload } from '@xyo-network/sdk-xyo-client-js'

import { GetSchemaQuery, QueryHandler } from '../model'

export interface GetSchemaQueryHandlerOpts {
  schemaArchivist: XyoSchemaCache<XyoSchemaNameToValidatorMap>
}

export class GetSchemaQueryHandler implements QueryHandler<GetSchemaQuery, XyoSchemaPayload> {
  constructor(protected readonly opts: GetSchemaQueryHandlerOpts) {}
  async handle(query: GetSchemaQuery) {
    const entry = await this.opts.schemaArchivist.get(query.payload.name)
    return entry?.payload
  }
}
