import { Request } from 'express'

import { requestCanAccessArchive } from './requestCanAccessArchive'

export const requestCanAccessArchives = async (req: Request, archives: string[]): Promise<boolean> => {
  const allAccessible = await Promise.all(archives.map((archive) => requestCanAccessArchive(req, archive)))
  const answer = allAccessible.every((accessible) => accessible)
  return answer
}
