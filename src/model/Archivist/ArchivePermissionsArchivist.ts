import { SetArchivePermissions } from '../Query'
import { Archivist } from './Archivist'

export type ArchivePermissionsArchivist = Archivist<SetArchivePermissions[], SetArchivePermissions[], SetArchivePermissions[] | null, string>
