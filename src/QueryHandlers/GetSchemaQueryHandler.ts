import { XyoSchemaCache, XyoSchemaPayload } from '@xyo-network/sdk-xyo-client-js'
import { inject, injectable } from 'inversify'

import { GetSchemaQuery, QueryHandler } from '../model'

@injectable()
export class GetSchemaQueryHandler implements QueryHandler<GetSchemaQuery, XyoSchemaPayload> {
  constructor(@inject(XyoSchemaCache) protected readonly schemaArchivist: XyoSchemaCache) {}
  async handle(query: GetSchemaQuery) {
    const entry = await this.schemaArchivist.get(query.payload.name)
    return entry?.payload
  }
}
