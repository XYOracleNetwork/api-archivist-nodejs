import { XyoArchive } from '@xyo-network/sdk-xyo-client-js'

import { isLegacyPrivateArchive } from '../../../lib'
import { ArchivePermissionsRepository, privateArchivePermissions, publicArchivePermissions, SetArchivePermissionsPayload } from '../../../model'

export const migrateLegacyArchives = async (repository: ArchivePermissionsRepository, archives: XyoArchive[]) => {
  const migrations = archives.map((archive) => {
    // create a new public/private archive record for the legacy archive
    const permissions: SetArchivePermissionsPayload = isLegacyPrivateArchive(archive) ? privateArchivePermissions : publicArchivePermissions
    return repository.insert([{ ...permissions, _archive: archive.archive } as SetArchivePermissionsPayload])
  })
  const results = await Promise.all(migrations)
  return results.map((result) => result?.[0])
}
