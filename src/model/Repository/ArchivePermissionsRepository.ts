import { SetArchivePermissions } from '../Query'
import { Repository } from './Repository'

export type ArchivePermissionsRepository = Repository<SetArchivePermissions[], SetArchivePermissions[], SetArchivePermissions[] | null, string>
