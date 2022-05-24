import { Request } from 'express'

export type ArchivePermissions = {
  // TODO: Add to/grab from SDK
  // TODO: Add to src/model temporarily
}

const getArchivePermissions = (req: Request, archive: string): Promise<ArchivePermissions> => {
  // TODO: Grab req.app.permissionsRepository/Diviner
  // to allow determining of archive permissions
  return Promise.resolve({})
}

const verifyAccountAllowed = (address: string, permissions: ArchivePermissions) => {
  return false
}
const verifySchemaAllowed = (schema: string, permissions: ArchivePermissions) => {
  return false
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
  // Get archive permissions from blockchain
  const permissions = await getArchivePermissions(req, archive)
  return verifyAccountAllowed(user.address, permissions) && verifySchemaAllowed(schema, permissions)
}
