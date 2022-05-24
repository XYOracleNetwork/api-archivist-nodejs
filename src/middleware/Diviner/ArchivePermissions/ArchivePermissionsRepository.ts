import { ArchivePermissions, Repository, UpsertResult } from '../../../model'

export type ArchivePermissionsRepository = Repository<ArchivePermissions[] & UpsertResult, ArchivePermissions[], ArchivePermissions[] | null, string>
