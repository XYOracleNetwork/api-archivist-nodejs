import { Request } from 'express'

import { requestCanAccessArchive } from './requestCanAccessArchive'

export const accessibleArchives = async (req: Request, archives: string[]): Promise<string[]> => {
  const accessible = await Promise.all(archives.map((archive) => requestCanAccessArchive(req, archive)))
  const accessibleArchives: string[] = []
  for (let i = 0; i < accessible.length; i++) {
    if (accessible[i]) accessibleArchives.push(archives[i])
  }
  return accessibleArchives
}
