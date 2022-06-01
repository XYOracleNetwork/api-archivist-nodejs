import { XyoPayload, XyoPayloadBody, XyoPayloadBuilder, XyoPayloadMeta } from '@xyo-network/sdk-xyo-client-js'

import { ArchivePermissionsRepository } from '../../middleware'
import { GetArchivePermissions, QueryHandler, SetArchivePermissions, SetArchivePermissionsPayload, setArchivePermissionsSchema } from '../../model'

const emptyPermissions = new XyoPayloadBuilder({ schema: setArchivePermissionsSchema }).build() as XyoPayload<SetArchivePermissions>

export interface GetArchivePermissionsQueryHandlerOpts {
  archivePermissionsRepository: ArchivePermissionsRepository
}

export class GetArchivePermissionsQueryHandler implements QueryHandler<GetArchivePermissions, SetArchivePermissionsPayload> {
  constructor(protected readonly opts: GetArchivePermissionsQueryHandlerOpts) {}
  async handle(command: GetArchivePermissions): Promise<XyoPayloadBody & XyoPayloadMeta & SetArchivePermissions> {
    if (!command._archive) {
      return emptyPermissions
    }
    const permissions = await this.opts.archivePermissionsRepository.get(command._archive)
    return (permissions?.[0] || emptyPermissions) as XyoPayload<SetArchivePermissions>
  }
}
