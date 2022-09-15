import { ArchivePermissionsArchivist, SetArchivePermissionsPayload, SetArchivePermissionsSchema } from '@xyo-network/archivist-model'
import { XyoPayloadWithPartialMeta } from '@xyo-network/payload'

const schema: SetArchivePermissionsSchema = SetArchivePermissionsSchema

const getPrivatePermissions = (_archive: string): XyoPayloadWithPartialMeta<SetArchivePermissionsPayload> => {
  return {
    _archive,
    _timestamp: Date.now(),
    addresses: {
      allow: [],
    },
    schema,
  }
}
const getPublicPermissions = (_archive: string): XyoPayloadWithPartialMeta<SetArchivePermissionsPayload> => {
  return { _archive, _timestamp: Date.now(), schema }
}

export function setArchiveAccessPublic(archivist: ArchivePermissionsArchivist, archive: string) {
  return archivist.insert([getPublicPermissions(archive)])
}
export function setArchiveAccessPrivate(archivist: ArchivePermissionsArchivist, archive: string) {
  return archivist.insert([getPrivatePermissions(archive)])
}
