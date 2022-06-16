import { ArchivePermissionsRepository, SetArchivePermissionsSchema, setArchivePermissionsSchema } from '../../model'

const getPrivatePermissions = (archive: string) => {
  return {
    _archive: archive,
    _timestamp: Date.now(),
    allow: {
      addresses: [],
    },
    schema: setArchivePermissionsSchema as SetArchivePermissionsSchema,
  }
}
const getPublicPermissions = (archive: string) => {
  return {
    _archive: archive,
    _timestamp: Date.now(),
    schema: setArchivePermissionsSchema as SetArchivePermissionsSchema,
  }
}

export function setArchiveAccessPublic(archivePermissionsRepository: ArchivePermissionsRepository, archive: string) {
  return setArchiveAccess(archivePermissionsRepository, archive, true)
}
export function setArchiveAccessPrivate(archivePermissionsRepository: ArchivePermissionsRepository, archive: string) {
  return setArchiveAccess(archivePermissionsRepository, archive, true)
}

function setArchiveAccess(archivePermissionsRepository: ArchivePermissionsRepository, archive: string, accessControl: boolean) {
  const permissions = accessControl ? getPrivatePermissions(archive) : getPublicPermissions(archive)
  return archivePermissionsRepository.insert([permissions])
}
