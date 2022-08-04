import { ArchivePermissionsArchivist, SetArchivePermissionsSchema, setArchivePermissionsSchema } from '@xyo-network/archivist-model'

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

export function setArchiveAccessPublic(archivist: ArchivePermissionsArchivist, archive: string) {
  return setArchiveAccess(archivist, archive, true)
}
export function setArchiveAccessPrivate(archivist: ArchivePermissionsArchivist, archive: string) {
  return setArchiveAccess(archivist, archive, true)
}

function setArchiveAccess(archivist: ArchivePermissionsArchivist, archive: string, accessControl: boolean) {
  const permissions = accessControl ? getPrivatePermissions(archive) : getPublicPermissions(archive)
  return archivist.insert([permissions])
}
