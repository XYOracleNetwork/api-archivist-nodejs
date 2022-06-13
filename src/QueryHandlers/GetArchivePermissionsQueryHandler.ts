import { XyoPayload, XyoPayloadBody, XyoPayloadBuilder, XyoPayloadMeta } from '@xyo-network/sdk-xyo-client-js'

import { ArchivePermissionsRepository } from '../middleware'
import { GetArchivePermissionsQuery, QueryHandler, SetArchivePermissions, SetArchivePermissionsPayload, setArchivePermissionsSchema } from '../model'

const getEmptyPermissions = (query: GetArchivePermissionsQuery): XyoPayload<SetArchivePermissions> => {
  return new XyoPayloadBuilder({ schema: setArchivePermissionsSchema })
    .fields({
      _queryId: query.id,
      _timestamp: Date.now(),
    })
    .build() as XyoPayload<SetArchivePermissions>
}
export interface GetArchivePermissionsQueryHandlerOpts {
  archivePermissionsRepository: ArchivePermissionsRepository
}

export class GetArchivePermissionsQueryHandler implements QueryHandler<GetArchivePermissionsQuery, SetArchivePermissionsPayload> {
  constructor(protected readonly opts: GetArchivePermissionsQueryHandlerOpts) {}
  async handle(query: GetArchivePermissionsQuery): Promise<XyoPayloadBody & XyoPayloadMeta & SetArchivePermissions> {
    if (!query.payload._archive) {
      return getEmptyPermissions(query)
    }
    const permissions = await this.opts.archivePermissionsRepository.get(query.payload._archive)
    return (permissions?.[0] || getEmptyPermissions(query)) as XyoPayload<SetArchivePermissions>
  }
}
