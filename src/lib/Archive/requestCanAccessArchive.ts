import { Request } from 'express'

import { isRequestUserOwnerOfArchive } from './isArchiveOwner'
import { isPublicArchive } from './legacyArchiveAccessControl'

export const requestCanAccessArchive = async (req: Request, name: string): Promise<boolean> => {
  const archive = await req.app.archiveRepository.get(name)
  // If the archive is public or if the archive is private but this is
  // an auth'd request from the archive owner
  return isPublicArchive(archive) || isRequestUserOwnerOfArchive(req, archive)
}

export const requestCanAccessArchives = async (req: Request, archives: string[]): Promise<boolean> => {
  const allAccessible = await Promise.all(archives.map((archive) => requestCanAccessArchive(req, archive)))
  const answer = allAccessible.every((accessible) => accessible)
  return answer
}
