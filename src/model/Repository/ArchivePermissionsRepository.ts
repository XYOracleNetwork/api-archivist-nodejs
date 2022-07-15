import { SetArchivePermissions } from '../Query'
import { Archivist } from './Repository'

export type ArchivePermissionsArchivist = Archivist<SetArchivePermissions[], SetArchivePermissions[], SetArchivePermissions[] | null, string>
