import { XyoPayload } from '@xyo-network/sdk-xyo-client-js'

export type ArchivePermissionsPayloadSchema = 'network.xyo.security.archive.permissions'

export interface Permissions {
  addresses: string[]
  schemas: string[]
}
export interface ArchivePermissions {
  allow: Partial<Permissions>
  reject: Partial<Permissions>
  schema: ArchivePermissionsPayloadSchema
}

export type ArchivePermissionsPayload = XyoPayload<ArchivePermissions>
