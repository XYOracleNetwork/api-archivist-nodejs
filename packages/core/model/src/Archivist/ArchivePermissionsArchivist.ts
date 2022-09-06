import { SetArchivePermissions } from '../Query'
import { _Archivist } from './Archivist'

export type ArchivePermissionsArchivist = _Archivist<
  SetArchivePermissions[],
  SetArchivePermissions[],
  SetArchivePermissions[] | null,
  string,
  SetArchivePermissions[]
>
