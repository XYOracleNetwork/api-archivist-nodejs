import { XyoArchive } from '@xyo-network/api'
import { isLegacyPrivateArchive } from '@xyo-network/archivist-express-lib'
import {
  ArchivePermissionsArchivist,
  privateArchivePermissions,
  publicArchivePermissions,
  SetArchivePermissionsPayload,
} from '@xyo-network/archivist-model'
import { XyoBoundWitness } from '@xyo-network/boundwitness'

export const migrateLegacyArchives = async (
  archivist: ArchivePermissionsArchivist,
  archives: XyoArchive[],
): Promise<Array<(XyoBoundWitness | null)[]>> => {
  const migrations = archives.map((archive) => {
    // create a new public/private archive record for the legacy archive
    const permissions: SetArchivePermissionsPayload = isLegacyPrivateArchive(archive) ? privateArchivePermissions : publicArchivePermissions
    return archivist.insert([{ ...permissions, _archive: archive.archive }])
  })
  return await Promise.all(migrations)
}
