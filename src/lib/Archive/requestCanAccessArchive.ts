import { Request } from 'express'

import { isRequestUserOwnerOfArchive } from './isArchiveOwner'
import { isPublicArchive } from './legacyArchiveAccessControl'

/**
 * Determines if the incoming request can access the supplied archive
 * @param req The incoming request
 * @param name The name of the archive to test if the request can access
 * @returns True if the request can access the archive, false otherwise
 */
export const requestCanAccessArchive = async (req: Request, name: string): Promise<boolean> => {
  const archive = await req.app.archiveRepository.get(name)
  // If the archive is public or if the archive is private but this is
  // an auth'd request from the archive owner
  return isPublicArchive(archive) || isRequestUserOwnerOfArchive(req, archive)
}
