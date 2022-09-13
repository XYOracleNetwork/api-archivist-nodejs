import { XyoArchive } from '@xyo-network/api'
import { isLegacyPrivateArchive } from '@xyo-network/archivist-express-lib'
import {
  ArchivePermissionsArchivist,
  privateArchivePermissions,
  publicArchivePermissions,
  SetArchivePermissionsPayload,
} from '@xyo-network/archivist-model'

export const migrateLegacyArchives = async (archivist: ArchivePermissionsArchivist, archives: XyoArchive[]) => {
  const migrations = archives.map((archive) => {
    // create a new public/private archive record for the legacy archive
    const permissions: SetArchivePermissionsPayload = isLegacyPrivateArchive(archive) ? privateArchivePermissions : publicArchivePermissions
    return archivist.insert([{ ...permissions, _archive: archive.archive } as SetArchivePermissionsPayload])
  })
  const results = await Promise.all(migrations)
  return results
}
