import { assertEx } from '@xylabs/sdk-js'
import { XyoPayloadBuilder } from '@xyo-network/sdk-xyo-client-js'

import { ArchivePermissionsRepository } from '../middleware'
import { QueryHandler, SetArchivePermissionsPayload, SetArchivePermissionsQuery, setArchivePermissionsSchema } from '../model'

export interface SetArchivePermissionsQueryHandlerOpts {
  archivePermissionsRepository: ArchivePermissionsRepository
}

export class SetArchivePermissionsQueryHandler implements QueryHandler<SetArchivePermissionsQuery, SetArchivePermissionsPayload> {
  constructor(protected readonly opts: SetArchivePermissionsQueryHandlerOpts) {}
  async handle(query: SetArchivePermissionsQuery): Promise<SetArchivePermissionsPayload> {
    await this.opts.archivePermissionsRepository.insert([query.payload])
    const archive = assertEx(query.payload._archive)
    const permissions = await this.opts.archivePermissionsRepository.get(archive)
    const currentPermissions = assertEx(permissions?.[0])
    return new XyoPayloadBuilder<SetArchivePermissionsPayload>({ schema: setArchivePermissionsSchema })
      .fields({ ...currentPermissions, _queryId: query.id, _timestamp: Date.now() })
      .build()
  }
}
