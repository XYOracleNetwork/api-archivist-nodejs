import { Request } from 'express'

const getArchivePermissions = (req: Request, archive: string): Promise<Record<string, unknown>> => {
  return Promise.resolve({})
}

const verifyAccountAllowed = (address: string, permissions: Record<string, unknown>) => {
  return false
}
const verifySchemaAllowed = (schema: string, permissions: Record<string, unknown>) => {
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
