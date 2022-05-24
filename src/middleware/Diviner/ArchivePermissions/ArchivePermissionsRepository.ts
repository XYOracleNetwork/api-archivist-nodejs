import { Repository, UpsertResult } from '../../../model'
import { ArchivePermissions } from './ArchivePermissions'

// TODO: Abstract payload Repository as base type?
export type ArchivePermissionsRepository = Repository<ArchivePermissions & UpsertResult, ArchivePermissions, ArchivePermissions | null, string>
