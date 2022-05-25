import { Request } from 'express'

import { SetArchivePermissions, setArchivePermissionsSchema } from '../../../../model'

const defaultArchivePermissions: SetArchivePermissions = {
  schema: setArchivePermissionsSchema,
}

const getArchivePermissions = async (req: Request, archive: string): Promise<SetArchivePermissions> => {
  const permissions = await req.app.archivePermissionsRepository.get(archive)
  return permissions && permissions?.[0] ? permissions?.[0] : defaultArchivePermissions
}

const verifyAccountAllowed = (address: string | undefined, permissions: SetArchivePermissions): boolean => {
  const allowedAddresses = permissions?.allow?.addresses
  const disallowedAddresses = permissions?.reject?.addresses

  // If there's address restrictions on the archive and this
  // is an anonymous request
  if ((allowedAddresses?.length || disallowedAddresses?.length) && !address) return false

  // If there's rejected addresses
  if (disallowedAddresses) {
    // And this address is one of them
    if (disallowedAddresses.some((a) => a === address)) return false
  }
  // If there's allowed addresses
  if (allowedAddresses) {
    // Return true if this address is allowed, otherwise false
    return allowedAddresses.some((a) => a === address) ? true : false
  }
  return true
}
const verifySchemaAllowed = (schema: string, permissions: SetArchivePermissions): boolean => {
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
  // Validate archive from request body
  const { _archive: archive, schema } = req.body
  if (!archive || !schema) {
    return false
  }
  // Get archive permissions
  const permissions = await getArchivePermissions(req, archive)
  const address = req?.user?.address
  return verifyAccountAllowed(address, permissions) && verifySchemaAllowed(schema, permissions)
}
