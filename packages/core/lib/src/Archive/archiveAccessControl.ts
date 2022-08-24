import { ArchivePermissionsArchivist, SetArchivePermissionsSchema, setArchivePermissionsSchema } from '@xyo-network/archivist-model'

const schema: SetArchivePermissionsSchema = setArchivePermissionsSchema

const getPrivatePermissions = (_archive: string) => {
  return {
    _archive,
    _timestamp: Date.now(),
    allow: {
      addresses: [],
    },
    schema,
  }
}
const getPublicPermissions = (_archive: string) => {
  return { _archive, _timestamp: Date.now(), schema }
}

export function setArchiveAccessPublic(archivist: ArchivePermissionsArchivist, archive: string) {
  return archivist.insert([getPublicPermissions(archive)])
}
export function setArchiveAccessPrivate(archivist: ArchivePermissionsArchivist, archive: string) {
  return archivist.insert([getPrivatePermissions(archive)])
}
