export interface Permissions {
  addresses: string[]
  schemas: string[]
}
export interface ArchivePermissions {
  allow: Partial<Permissions>
  reject: Partial<Permissions>
  schema: 'network.xyo.security.archive.permissions'
}
