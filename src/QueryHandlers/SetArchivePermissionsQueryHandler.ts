import { ArchivePermissionsRepository } from '../middleware'
import { QueryHandler, SetArchivePermissionsQuery } from '../model'

export interface SetArchivePermissionsQueryHandlerOpts {
  archivePermissionsRepository: ArchivePermissionsRepository
}

export class SetArchivePermissionsQueryHandler implements QueryHandler<SetArchivePermissionsQuery, void> {
  constructor(protected readonly opts: SetArchivePermissionsQueryHandlerOpts) {}
  async handle(query: SetArchivePermissionsQuery): Promise<void> {
    await this.opts.archivePermissionsRepository.insert([query.payload])
  }
}
