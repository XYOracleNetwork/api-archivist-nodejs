import { XyoArchive } from '@xyo-network/sdk-xyo-client-js'

import { isLegacyPrivateArchive } from '../../../lib'
import { ArchivePermissionsRepository, SetArchivePermissionsPayload, setArchivePermissionsSchema } from '../../../model'

const schema = setArchivePermissionsSchema
const publicArchivePermissions: SetArchivePermissionsPayload = {
  schema,
}

const privateArchivePermissions: SetArchivePermissionsPayload = {
  addresses: {
    allow: [],
  },
  schema,
}

// TODO: Witness each record by Archivist?
export const migrateLegacyArchives = async (repository: ArchivePermissionsRepository, archives: XyoArchive[]) => {
  const migrations = archives.map((archive) => {
    // create a new public/private archive record for the legacy archive
    const permissions: SetArchivePermissionsPayload = isLegacyPrivateArchive(archive) ? privateArchivePermissions : publicArchivePermissions
    return repository.insert([{ ...permissions, _archive: archive.archive } as SetArchivePermissionsPayload])
  })
  const results = await Promise.all(migrations)
  return results.map((result) => result?.[0])
}
