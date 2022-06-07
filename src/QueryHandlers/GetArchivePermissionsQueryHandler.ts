import { XyoPayload, XyoPayloadBody, XyoPayloadBuilder, XyoPayloadMeta } from '@xyo-network/sdk-xyo-client-js'

import { ArchivePermissionsRepository } from '../middleware'
import { GetArchivePermissionsQuery, QueryHandler, SetArchivePermissions, SetArchivePermissionsPayload, setArchivePermissionsSchema } from '../model'

const emptyPermissions = new XyoPayloadBuilder({ schema: setArchivePermissionsSchema }).build() as XyoPayload<SetArchivePermissions>

export interface GetArchivePermissionsQueryHandlerOpts {
  archivePermissionsRepository: ArchivePermissionsRepository
}

export class GetArchivePermissionsQueryHandler implements QueryHandler<GetArchivePermissionsQuery, SetArchivePermissionsPayload> {
  constructor(protected readonly opts: GetArchivePermissionsQueryHandlerOpts) {}
  async handle(query: GetArchivePermissionsQuery): Promise<XyoPayloadBody & XyoPayloadMeta & SetArchivePermissions> {
    if (!query.payload._archive) {
      return emptyPermissions
    }
    const permissions = await this.opts.archivePermissionsRepository.get(query.payload._archive)
    return (permissions?.[0] || emptyPermissions) as XyoPayload<SetArchivePermissions>
  }
}
