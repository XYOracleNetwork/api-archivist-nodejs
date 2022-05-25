import { XyoPayload, XyoPayloadBody, XyoPayloadBuilder, XyoPayloadMeta } from '@xyo-network/sdk-xyo-client-js'

import { ArchivePermissionsRepository } from '../../middleware'
import { GetArchivePermissions, QueryHandler, SetArchivePermissions, SetArchivePermissionsPayload } from '../../model'

const emptyPermissions = new XyoPayloadBuilder({ schema: 'network.xyo.security.archive.permissions.set' }).build() as XyoPayload<SetArchivePermissions>

export interface GetArchivePermissionsCommandHandlerOpts {
  archivePermissionsRepository: ArchivePermissionsRepository
}

export class GetArchivePermissionsQueryHandler implements QueryHandler<GetArchivePermissions, SetArchivePermissionsPayload> {
  constructor(protected readonly opts: GetArchivePermissionsCommandHandlerOpts) {}
  async handle(command: GetArchivePermissions): Promise<XyoPayloadBody & XyoPayloadMeta & SetArchivePermissions> {
    if (!command._archive) {
      return emptyPermissions
    }
    const permissions = await this.opts.archivePermissionsRepository.get(command._archive)
    return (permissions || emptyPermissions) as XyoPayload<SetArchivePermissions>
  }
}
