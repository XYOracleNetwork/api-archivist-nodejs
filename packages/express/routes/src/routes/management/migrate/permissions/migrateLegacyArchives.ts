import { XyoArchive } from '@xyo-network/api'
import { isLegacyPrivateArchive } from '@xyo-network/archivist-express-lib'
import {
  ArchivePermissionsArchivistFactory,
  privateArchivePermissions,
  publicArchivePermissions,
  SetArchivePermissionsPayload,
} from '@xyo-network/archivist-model'
import { XyoBoundWitness } from '@xyo-network/boundwitness'

export const migrateLegacyArchives = (
  archivist: ArchivePermissionsArchivistFactory,
  archives: XyoArchive[],
): Promise<Array<XyoBoundWitness | null>> => {
  const migrations = archives.map((archive) => {
    // create a new public/private archive record for the legacy archive
    const permissions: SetArchivePermissionsPayload = isLegacyPrivateArchive(archive) ? privateArchivePermissions : publicArchivePermissions
    return archivist(archive.archive).insert([{ ...permissions, _archive: archive.archive }])
  })
  return Promise.all(migrations)
}
