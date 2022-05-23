import { Request } from 'express'

const verifyAccountAllowed = () => {
  return false
}
const verifySchemaAllowed = () => {
  return false
}

export const verifyOperationAllowedByAddress = async (req: Request): Promise<boolean> => {
  // Validate user & address from request
  const { user } = req
  if (!user || !user.address) {
    return false
  }
  // Validate archive from request
  const { archive } = req.params
  if (!archive) {
    return false
  }
  const existingArchive = await req.app.archiveRepository.get(archive)
  // Validate user is archive owner
  return !!existingArchive && existingArchive.user === user.id
}
