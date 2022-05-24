import { Request } from 'express'

import { ArchivePermissions } from '../../../../model'

const defaultArchivePermissions: ArchivePermissions = {
  schema: 'network.xyo.security.archive.permissions',
}

const getArchivePermissions = async (req: Request, archive: string): Promise<ArchivePermissions> => {
  const permissions = await req.app.archivePermissionsRepository.get(archive)
  return permissions?.[0] || defaultArchivePermissions
}

const verifyAccountAllowed = (address: string, permissions: ArchivePermissions): boolean => {
  // If there's rejected addresses
  if (permissions?.reject?.addresses) {
    // And this address is one of them
    if (permissions.reject.addresses.some((a) => a === address)) return false
  }
  // If there's allowed addresses
  if (permissions?.allow?.addresses) {
    // Return true if this address is allowed, otherwise false
    permissions.allow.addresses.some((a) => a === address) ? true : false
  }
  return true
}
const verifySchemaAllowed = (schema: string, permissions: ArchivePermissions): boolean => {
  // If there's rejected schemas
  if (permissions?.reject?.schemas) {
    // And this schema is one of them
    if (permissions.reject.schemas.some((a) => a === schema)) return false
  }
  // If there's allowed schemas
  if (permissions?.allow?.schemas) {
    // Return true if this schema is allowed, otherwise false
    permissions.allow.schemas.some((a) => a === schema) ? true : false
  }
  return true
}

export const verifyOperationAllowedByAddress = async (req: Request): Promise<boolean> => {
  // Validate user & address from request
  const { user } = req
  if (!user || !user.address) {
    return false
  }
  // Validate archive from request body
  const { _archive: archive, schema } = req.body
  if (!archive || !schema) {
    return false
  }
  // Get archive permissions
  const permissions = await getArchivePermissions(req, archive)
  return verifyAccountAllowed(user.address, permissions) && verifySchemaAllowed(schema, permissions)
}
