import { ArchivePermissionsRepository } from '../middleware'
import { QueryHandler, SetArchivePermissions } from '../model'

export interface SetArchivePermissionsQueryHandlerOpts {
  archivePermissionsRepository: ArchivePermissionsRepository
}

export class SetArchivePermissionsQueryHandler implements QueryHandler<SetArchivePermissions, void> {
  constructor(protected readonly opts: SetArchivePermissionsQueryHandlerOpts) {}
  async handle(command: SetArchivePermissions): Promise<void> {
    await this.opts.archivePermissionsRepository.insert([command])
  }
}
