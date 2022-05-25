import { ArchivePermissionsRepository } from '../../middleware'
import { CommandHandler, SetArchivePermissions } from '../../model'

export interface SetArchivePermissionsCommandHandlerOpts {
  archivePermissionsRepository: ArchivePermissionsRepository
}

export class SetArchivePermissionsCommandHandler implements CommandHandler<SetArchivePermissions> {
  constructor(protected readonly opts: SetArchivePermissionsCommandHandlerOpts) {}
  async handle(command: SetArchivePermissions): Promise<void> {
    await this.opts.archivePermissionsRepository.insert([command])
  }
}
